"use server";
import {
  ApiError,
  LoginCredentials,
  LoginResponse,
  LoginResult,
  School,
  User,
} from "@/types/login";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_URL;

// Custom error class for login errors
class LoginError extends Error {
  public code?: string;
  public status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "LoginError";
    this.code = code;
    this.status = status;
  }
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new LoginError(
        errorData.message || "Login failed",
        errorData.code,
        response.status
      );
    }

    const loginData: LoginResponse = await response.json();

    // Validate response structure
    if (!loginData.user || !loginData.accessToken || !loginData.refreshToken) {
      throw new LoginError(
        "Invalid response format from server",
        "INVALID_RESPONSE"
      );
    }

    // Create server sessions
    await createServerSession(loginData);

    // Handle school data for non-super-admin users
    let school: School | null = null;
    if (loginData.school && loginData.user.role !== "SUPER_ADMIN") {
      school = loginData.school;
      // Debug log to check what we're saving
      await saveServerSchool(school);
    }

    return {
      success: true,
      data: loginData,
      school: school, // Remove this redundant field - it's already in loginData
    };
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Login failed";

    if (error instanceof LoginError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Create server session with tokens
export async function createServerSession(
  loginData: LoginResponse
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();

    // Set access token (short-lived)
    cookieStore.set("accessToken", loginData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token (long-lived)
    cookieStore.set("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set user data (excluding sensitive info)
    const safeUserData = {
      id: loginData.user.id,
      name: loginData.user.name,
      email: loginData.user.email,
      role: loginData.user.role,
      schoolId: loginData.user.schoolId,
      phone: loginData.user.phone,
      status: loginData.user.status,
      isVerified: loginData.user.isVerified,
      image: loginData.user.image,
      createdAt: loginData.user.createdAt,
      updatedAt: loginData.user.updatedAt,
    };

    cookieStore.set("user", JSON.stringify(safeUserData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });

    return { success: true };
  } catch (error) {
    console.error("Session creation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create session",
    };
  }
}

// Save school data to cookies (only for non-super-admin users)
export async function saveServerSchool(
  school: School
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();

    // Store the complete school object (not just the ID)
    const schoolData = {
      id: school.id,
      name: school.name,
      code: school.code,
      subdomain: school.subdomain,
      logo: school.logo,
      isActive: school.isActive,
    };

    cookieStore.set("school", JSON.stringify(schoolData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days (longer than user session)
    });

    return { success: true };
  } catch (error) {
    console.error("School save error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save school data",
    };
  }
}

// Create user login log
export async function createLoginLog(
  userId: string,
  userName: string,
  deviceInfo: { device?: string; ipAddress?: string }
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/users/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: userName,
        activity: "User Login",
        time: new Date().toISOString(),
        device: deviceInfo.device || "Unknown Device",
        ipAddress: deviceInfo.ipAddress || "Unknown IP",
      }),
    });
  } catch (error) {
    // Log creation failure shouldn't break the login flow
    console.warn("Failed to create login log:", error);
  }
}

// Logout function
export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies();

    // Clear all auth cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");
    cookieStore.delete("school");
  } catch (error) {
    console.error("Logout error:", error);
  }
}
export async function getSchool(): Promise<School | null> {
  try {
    const cookieStore = await cookies();
    const schoolCookie = cookieStore.get("school");

    if (!schoolCookie) return null;

    const school: School = JSON.parse(schoolCookie.value);
    return school;
  } catch (error) {
    console.error("Failed to get school:", error);
    return null;
  }
}
// Helper function to get server-side auth data
export async function getServerAuthData(): Promise<{
  user: User | null;
  school: School | null;
  accessToken: string | null;
}> {
  try {
    const cookieStore = await cookies();

    const userCookie = cookieStore.get("user");
    const schoolCookie = cookieStore.get("school");
    const accessTokenCookie = cookieStore.get("accessToken");

    const user = userCookie ? JSON.parse(userCookie.value) : null;
    const school = schoolCookie ? JSON.parse(schoolCookie.value) : null;
    const accessToken = accessTokenCookie ? accessTokenCookie.value : null;

    return {
      user,
      school,
      accessToken,
    };
  } catch (error) {
    return {
      user: null,
      school: null,
      accessToken: null,
    };
  }
}
