// Base school data types
export interface SchoolCreateData {
  name: string;
  code: string;
  subdomain: string | null;
  logo: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  address: string | null;
  website: string | null;
  establishedYear: number | null;
  slogan: string | null;
  description: string | null;
  isActive: boolean;
  adminUser: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "ADMIN";
  };
}

// Form data type (matches your form schema)
export interface SchoolFormData {
  // Step 1: School Information
  name: string;
  code: string;
  primaryEmail?: string;
  primaryPhone?: string;
  address?: string;
  website?: string;
  establishedYear?: number;
  slogan?: string;
  description?: string;
  // Step 2: Subdomain
  subdomain: string;
  // Step 3: Admin Credentials
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  confirmPassword: string;
}

// API Response types
export interface SchoolCreationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    code: string;
    subdomain: string;
    isActive: boolean;
    createdAt: string;
    adminUser: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  error?: string;
}

// Subdomain availability check
export interface SubdomainAvailabilityResponse {
  available: boolean;
  error?: string;
  message?: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
