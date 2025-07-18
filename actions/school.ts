"use server";

import { api } from "@/config/api-client";
import type {
  SchoolFormData,
  SchoolCreateData,
  SchoolCreationResponse,
  SubdomainAvailabilityResponse,
} from "@/types/school";

function transformFormDataToApiFormat(
  formData: SchoolFormData
): SchoolCreateData {
  return {
    name: formData.name,
    code: formData.code,
    subdomain: formData.subdomain,
    logo: null,
    primaryEmail: formData.primaryEmail || null,
    primaryPhone: formData.primaryPhone || null,
    address: formData.address || null,
    website: formData.website || null,
    establishedYear: formData.establishedYear || null,
    slogan: formData.slogan || null,
    description: formData.description || null,
    isActive: true,
    adminUser: {
      name: formData.adminName,
      email: formData.adminEmail,
      phone: formData.adminPhone,
      password: formData.adminPassword,
      role: "ADMIN" as const,
    },
  };
}

export async function createSchoolAction(
  formData: SchoolFormData
): Promise<SchoolCreationResponse> {
  try {
    // Transform form data to match API expectations
    const apiData = transformFormDataToApiFormat(formData);
    const response = await api.post("/school", apiData);

    return {
      success: true,
      message:
        "School created successfully! You can now access your admin dashboard.",
      data: response.data,
    };
  } catch (error) {
    console.log("Failed to create school:", error);

    return {
      success: false,
      message: "Failed to create school. Please try again.",
      error: "Something went wrong",
    };
  }
}

// Since subdomain check API is not available, we'll do basic client-side validation
export async function checkSubdomainAvailability(
  subdomain: string
): Promise<SubdomainAvailabilityResponse> {
  try {
    if (!subdomain || subdomain.length < 3) {
      return {
        available: false,
        error: "Subdomain must be at least 3 characters",
      };
    }

    // Basic client-side validation since API endpoint doesn't exist
    // You can implement this when the API endpoint is available
    const isValidFormat = /^[a-z0-9-]+$/.test(subdomain);

    if (!isValidFormat) {
      return {
        available: false,
        error: "Only lowercase letters, numbers, and hyphens allowed",
      };
    }

    // For now, assume it's available if format is correct
    // Replace this with actual API call when endpoint is ready:
    // const response = await api.get(`/schools/check-subdomain?subdomain=${subdomain}`);

    return {
      available: true,
      message: "Subdomain appears to be available",
    };
  } catch (error) {
    console.log("Failed to check subdomain availability:", error);

    return {
      available: false,
      error: "Failed to check subdomain availability",
    };
  }
}
