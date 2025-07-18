import { getSchoolBySubdomain } from "@/actions/auth";
import {
  createSchoolAction,
  checkSubdomainAvailability,
} from "@/actions/school";
import { School } from "@/types/auth2";
import type {
  SchoolFormData,
  SchoolCreationResponse,
  SubdomainAvailabilityResponse,
} from "@/types/school";

interface SchoolServiceProps {
  create: (data: SchoolFormData) => Promise<SchoolCreationResponse>;
  checkSubdomain: (subdomain: string) => Promise<SubdomainAvailabilityResponse>;
  getBySubdomain: (subdomain: string) => Promise<School | null>;
}

export const schoolService: SchoolServiceProps = {
  create: async (data: SchoolFormData) => {
    const response = await createSchoolAction(data);
    if (!response.success) {
      throw new Error(
        response.error || response.message || "Failed to create school"
      );
    }
    return response;
  },

  checkSubdomain: async (subdomain: string) => {
    const response = await checkSubdomainAvailability(subdomain);
    if (response.error && !response.available) {
      // Don't throw for availability checks, just return the result
      return response;
    }
    return response;
  },
  getBySubdomain: async (subdomain: string): Promise<School | null> => {
    try {
      const school = await getSchoolBySubdomain(subdomain);
      return school;
    } catch (error) {
      console.error("Error fetching school by subdomain:", error);
      throw error;
    }
  },
};
