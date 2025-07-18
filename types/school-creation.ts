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

export interface SchoolCreationResponse {
  success: boolean;
  message: string;
  data?: {
    school: any;
    admin: any;
    subdomain: string;
  };
  error?: string;
}

export interface SubdomainValidationResponse {
  available: boolean;
  message: string;
}
