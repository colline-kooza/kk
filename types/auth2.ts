// types/auth2.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "TEACHER"
    | "RECEPTIONIST"
    | "ACCOUNTANT"
    | "LIBRARIAN"
    | "STUDENT"
    | "PARENT";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  isVerified: boolean;
  image: string | null;
  schoolId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  subdomain: string | null;
  logo: string | null;
  isActive: boolean;
  settings?: SchoolSettings;
}

export interface SchoolSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  features?: {
    enableLibrary?: boolean;
    enableAccounting?: boolean;
    enableParentPortal?: boolean;
  };
}

export interface SubdomainContext {
  subdomain: string;
  school: School;
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  school: School | null;
  session: SessionInfo;
  subdomainUrl?: string | null;
}

export interface SessionInfo {
  expiresAt: string;
  refreshExpiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
  subdomain?: string;
}

export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  school?: School | null;
  error?: string;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  device?: string;
  ipAddress?: string;
}

export interface AuthStore {
  user: User | null;
  school: School | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setSchool: (school: School) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  updateSchool: (school: Partial<School>) => void;
}

export interface ApiError {
  message: string;
  code: string;
  status?: string;
}

export interface LoginError extends Error {
  code?: string;
  status?: number;
}
