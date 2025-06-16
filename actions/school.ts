"use server";

import { SchoolFormData } from "@/components/dashboard/school-profile/SchoolProfileForm";
import { saveServerSchool } from "./auth";

export interface School {
  id: string;
  name: string;
  logo?: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  address?: string | null;
  website?: string | null;
  establishedYear?: number | null;
  slogan?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const API_BASE_URL = process.env.API_URL || "http://localhost:3001";
export async function createSchool(
  schoolData: SchoolFormData
): Promise<School> {
  try {
    const response = await fetch(`${API_BASE_URL}/school`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...schoolData,
        // Convert empty strings to null for optional fields
        logo: schoolData.logo || null,
        primaryEmail: schoolData.primaryEmail || null,
        primaryPhone: schoolData.primaryPhone || null,
        address: schoolData.address || null,
        website: schoolData.website || null,
        slogan: schoolData.slogan || null,
        description: schoolData.description || null,
        establishedYear: schoolData.establishedYear || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create school: ${response.status}`
      );
    }

    const createdSchool: School = await response.json();
    await saveServerSchool(createdSchool);
    return createdSchool;
  } catch (error) {
    console.error("Error creating school:", error);
    throw error;
  }
}
