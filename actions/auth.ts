// actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/store/auth";
import { School } from "./school";

const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

// Session data interface
interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
// Helper function to decode JWT and check expiry
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If we can't decode, assume expired
  }
}
async function refreshTokens(): Promise<{
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie) {
      return { success: false, error: "No refresh token available" };
    }

    // Check if refresh token is expired
    if (isTokenExpired(refreshTokenCookie.value)) {
      // Refresh token is expired, clear all cookies
      await clearAuthCookies();
      return { success: false, error: "Refresh token expired" };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
    });

    if (!response.ok) {
      // Refresh failed, clear cookies
      await clearAuthCookies();
      return { success: false, error: "Token refresh failed" };
    }

    const result: RefreshResponse = await response.json();

    // Update tokens in cookies
    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return {
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    await clearAuthCookies();
    return { success: false, error: "Token refresh failed" };
  }
}
async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("school");
}
// Login user function
export async function loginUser(credentials: LoginCredentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const loginData: LoginResponse = await response.json();

    // Create server sessions
    await createServerSession(loginData);

    // Get school information
    const school = await getSchoolById("school_id_placeholder"); // You'll need to get the actual school ID
    if (school) {
      await saveServerSchool(school);
    }

    return {
      success: true,
      data: loginData,
      school: school,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

// Register user function
export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

// Create server session with cookies
export async function createServerSession(data: LoginResponse) {
  try {
    const cookieStore = await cookies();

    // Set user cookie
    cookieStore.set("user", JSON.stringify(data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    // Set access token cookie
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    // Set refresh token cookie
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error("Session creation error:", error);
    return { success: false, error: "Failed to create session" };
  }
}

// Save school data to cookies
export async function saveServerSchool(school: School) {
  try {
    const cookieStore = await cookies();

    cookieStore.set("school", JSON.stringify(school), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error("School save error:", error);
    return { success: false, error: "Failed to save school data" };
  }
}

// Get school by ID
export async function getSchoolById(schoolId: string): Promise<School | null> {
  try {
    // For now, return a mock school object
    // In a real implementation, you'd fetch from your API
    // const mockSchool: School = {
    //   id: "school_1",
    //   name: "Mount Carmel School",
    //   logo: "https://example.com/logo.png",
    //   primaryEmail: "info@mountcarmelschool.edu",
    //   primaryPhone: "+256-700-123456",
    //   address: "123 Education Street, Kampala, Uganda",
    //   website: "https://www.mountcarmelschool.edu",
    //   establishedYear: 1985,
    //   slogan: "Excellence in Education",
    //   description: "A premier educational institution",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // };

    return null;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
}

// Logout function
export async function logout() {
  try {
    const cookieStore = await cookies();

    // Get refresh token for API logout
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (refreshTokenCookie) {
      // Call API logout endpoint
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
        });
      } catch (error) {
        console.error("API logout error:", error);
        // Continue with local logout even if API call fails
      }
    }

    // Delete all authentication cookies
    await clearAuthCookies();

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

// Get current user from server cookies
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!userCookie || !accessTokenCookie) {
      return null;
    }

    // Check if access token is expired
    if (isTokenExpired(accessTokenCookie.value)) {
      console.log("Access token expired, attempting refresh...");

      // Try to refresh the token
      const refreshResult = await refreshTokens();

      if (!refreshResult.success) {
        console.log("Token refresh failed:", refreshResult.error);
        return null;
      }

      console.log("Token refreshed successfully");
    }

    const user = JSON.parse(userCookie.value);
    return user as User;
  } catch (error) {
    console.error("Error getting server user:", error);
    await clearAuthCookies();
    return null;
  }
}

// Get current school from server cookies
export async function getServerSchool(): Promise<School | null> {
  try {
    const cookieStore = await cookies();
    const schoolCookie = cookieStore.get("school");

    if (!schoolCookie) return null;

    const school = JSON.parse(schoolCookie.value);
    return school as School;
  } catch (error) {
    console.error("Error getting server school:", error);
    return null;
  }
}

// Get access token from server cookies
export async function getServerAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie) {
      return null;
    }

    // Check if access token is expired
    if (isTokenExpired(accessTokenCookie.value)) {
      console.log("Access token expired, attempting refresh...");

      // Try to refresh the token
      const refreshResult = await refreshTokens();

      if (!refreshResult.success) {
        console.log("Token refresh failed:", refreshResult.error);
        return null;
      }

      return refreshResult.accessToken || null;
    }

    return accessTokenCookie.value;
  } catch (error) {
    console.error("Error getting server access token:", error);
    return null;
  }
}

export async function validateSession(): Promise<{
  isValid: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const user = await getServerUser();

    if (!user) {
      return { isValid: false, error: "No valid session" };
    }

    // Additional validation: verify with backend
    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      await clearAuthCookies();
      return { isValid: false, error: "No valid access token" };
    }

    // Verify token with backend
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      await clearAuthCookies();
      return { isValid: false, error: "Token verification failed" };
    }

    return { isValid: true, user };
  } catch (error) {
    console.error("Session validation error:", error);
    await clearAuthCookies();
    return { isValid: false, error: "Session validation failed" };
  }
}
