// actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, LoginCredentials, School, User } from "@/types/login";
import { API_BASE_URL } from "@/lib/enviroment";
import { LoginResponse, LoginResult, SubdomainContext } from "@/types/auth2";
import { buildSubdomainUrl } from "@/utils/utils";

// Helper function to decode JWT and check expiry
function isTokenExpired(token: string): boolean {
  try {
    if (!token || typeof token !== "string") return true;
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    if (!base64Url) return true;
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
    return true;
  }
}

// Server action to clear auth cookies
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

// Create server session with tokens - FIXED VERSION
export async function createServerSession(
  loginData: LoginResponse
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      domain: isProduction
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : undefined, // Don't set domain for localhost
    };

    // Set tokens first
    cookieStore.set("accessToken", loginData.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set("refreshToken", loginData.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Prepare safe user data
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

    // Set user cookie
    cookieStore.set("user", JSON.stringify(safeUserData), {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    console.log("Session created successfully for user:", loginData.user.email);
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

// Save school data to cookies - FIXED VERSION
export async function saveServerSchool(
  school: School
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

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
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      domain: isProduction
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : undefined, // Don't set domain for localhost
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("School saved successfully:", school.name);
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

// FIXED Login user function
export async function loginUser(
  credentials: LoginCredentials,
  subdomainContext?: string
): Promise<LoginResult> {
  try {
    console.log("Starting login process for:", credentials.email);

    const loginPayload = {
      ...credentials,
      subdomain: subdomainContext?.toLowerCase(),
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      console.error("Login API error:", errorData);
      throw new Error(errorData.message || "Login failed");
    }

    const loginData: LoginResponse = await response.json();

    if (!loginData.user || !loginData.accessToken || !loginData.refreshToken) {
      throw new Error("Invalid response format from server");
    }

    // Create session FIRST
    const sessionResult = await createServerSession(loginData);
    if (!sessionResult.success) {
      console.error("Session creation failed:", sessionResult.error);
      throw new Error(sessionResult.error || "Failed to create session");
    }

    let school: School | null = null;
    let subdomainUrl: string | null = null;

    // Handle school data for non-super-admin users
    if (loginData.school && loginData.user.role !== "SUPER_ADMIN") {
      school = loginData.school;
      const schoolResult = await saveServerSchool(school);
      if (!schoolResult.success) {
        console.error("School save failed:", schoolResult.error);
        // Don't fail the login, just log the error
      }

      if (school.subdomain) {
        subdomainUrl = buildSubdomainUrl(school.subdomain, "/dashboard");
      }
    }

    console.log("Login successful for:", loginData.user.email);
    return {
      success: true,
      data: {
        ...loginData,
        subdomainUrl,
      },
      school,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

// Server action to refresh tokens
export async function refreshTokens(): Promise<{
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

    if (isTokenExpired(refreshTokenCookie.value)) {
      await clearAuthCookies();
      return { success: false, error: "Refresh token expired" };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
    });

    if (!response.ok) {
      await clearAuthCookies();
      return { success: false, error: "Token refresh failed" };
    }

    const result: { accessToken: string; refreshToken: string } =
      await response.json();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      domain: isProduction
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : undefined,
    };

    cookieStore.set("accessToken", result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60,
    });
    cookieStore.set("refreshToken", result.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60,
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

// Get current user from server cookies (READ ONLY)
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!userCookie || !accessTokenCookie) {
      console.log("No user or access token cookie found");
      return null;
    }

    if (isTokenExpired(accessTokenCookie.value)) {
      console.log("Access token expired");
      return null;
    }

    const user = JSON.parse(userCookie.value) as User;
    console.log("Retrieved user from cookies:", user.email);
    return user;
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

// Get current school from server cookies
export async function getServerSchool(): Promise<School | null> {
  try {
    const cookieStore = await cookies();
    const schoolCookie = cookieStore.get("school");

    if (!schoolCookie) {
      console.log("No school cookie found");
      return null;
    }

    const school = JSON.parse(schoolCookie.value) as School;
    console.log("Retrieved school from cookies:", school.name);
    return school;
  } catch (error) {
    console.error("Error getting server school:", error);
    return null;
  }
}

// Get access token from server cookies (READ ONLY)
export async function getServerAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie) {
      console.log("No access token cookie found");
      return null;
    }

    if (isTokenExpired(accessTokenCookie.value)) {
      console.log("Access token expired");
      return null;
    }

    return accessTokenCookie.value;
  } catch (error) {
    console.error("Error getting server access token:", error);
    return null;
  }
}

// Validate session
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

    const accessToken = await getServerAccessToken();

    if (!accessToken) {
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
      return { isValid: false, error: "Token verification failed" };
    }

    return { isValid: true, user };
  } catch (error) {
    console.error("Session validation error:", error);
    return { isValid: false, error: "Session validation failed" };
  }
}

// Logout function
export async function logout() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (refreshTokenCookie) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
        });
      } catch (error) {
        console.error("API logout error:", error);
      }
    }

    await clearAuthCookies();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

// Helper function to get server-side auth data
export async function getServerAuthData(): Promise<{
  user: User | null;
  school: School | null;
  accessToken: string | null;
}> {
  try {
    const user = await getServerUser();
    const school = await getServerSchool();
    const accessToken = await getServerAccessToken();

    return { user, school, accessToken };
  } catch (error) {
    console.error("Error getting server auth data:", error);
    return { user: null, school: null, accessToken: null };
  }
}

// Get school by subdomain
export async function getSchoolBySubdomain(
  subdomain: string
): Promise<School | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/schools/subdomain/${subdomain.toLowerCase()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) return null;

    const school: School = await response.json();
    return school;
  } catch (error) {
    console.error("Error fetching school by subdomain:", error);
    return null;
  }
}

// Get subdomain context
export async function getSubdomainContext(
  subdomain: string
): Promise<SubdomainContext | null> {
  try {
    const school = await getSchoolBySubdomain(subdomain.toLowerCase());
    if (!school) return null;

    return {
      subdomain: subdomain.toLowerCase(),
      school,
      isActive: school.isActive,
    };
  } catch (error) {
    console.error("Error getting subdomain context:", error);
    return null;
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
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
      headers: { "Content-Type": "application/json" },
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
    console.warn("Failed to create login log:", error);
  }
}

// Create user logout log
export async function createLoginOut(
  userId: string,
  userName: string,
  deviceInfo: { device?: string; ipAddress?: string }
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/users/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        name: userName,
        activity: "User Logout",
        time: new Date().toISOString(),
        device: deviceInfo.device || "Unknown Device",
        ipAddress: deviceInfo.ipAddress || "Unknown IP",
      }),
    });
  } catch (error) {
    console.warn("Failed to create logout log:", error);
  }
}

// Server action to handle session refresh and redirect
export async function handleSessionRefresh() {
  try {
    const refreshResult = await refreshTokens();

    if (!refreshResult.success) {
      await clearAuthCookies();
      redirect("/auth/login");
    }

    return { success: true };
  } catch (error) {
    console.error("Session refresh error:", error);
    await clearAuthCookies();
    redirect("/auth/login");
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
