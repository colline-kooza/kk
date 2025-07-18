"use server";

import { api } from "@/config/api-client";
import {
  SchoolApplicationResponse,
  UpdateStatusRequest,
} from "@/types/school-application-detailed";
import type {
  QueriesSchoolApplicationsResponse,
  SchoolApplicationsFilters,
} from "@/types/school-applications";
import { getServerUser } from "./auth";

export async function getSchoolApplications(
  filters: SchoolApplicationsFilters = {}
): Promise<QueriesSchoolApplicationsResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status && filters.status !== "all")
      params.append("status", filters.status);
    if (filters.role && filters.role !== "all")
      params.append("role", filters.role);
    if (filters.country && filters.country !== "all")
      params.append("country", filters.country);
    if (filters.search) params.append("search", filters.search);

    const queryString = params.toString();
    const url = `/school-applications${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    const data = response.data;

    return {
      success: true,
      message: "School applications fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching school applications:", error);
    return {
      success: false,
      error: "Failed to fetch school applications",
      data: {
        applications: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        stats: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          byCountry: {},
          byRole: {},
        },
      },
    };
  }
}

export async function getSchoolApplication(
  id: string
): Promise<SchoolApplicationResponse> {
  try {
    const user = await getServerUser();

    const response = await api.get(`/school-applications/${id}`, {
      params: {
        userId: user?.id,
      },
    });

    return {
      success: true,
      message: "School application fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching school application:", error);
    return {
      success: false,
      error: "Failed to fetch school application",
    };
  }
}

export async function updateApplicationStatus(
  request: UpdateStatusRequest
): Promise<SchoolApplicationResponse> {
  try {
    const user = await getServerUser();

    const response = await api.patch(
      `/school-applications/${request.applicationId}/process?userId=${user?.id}`,
      {
        status: request.status,
        rejectionReason: request.rejectionReason,
      }
    );

    return {
      success: true,
      message: "Application status updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      success: false,
      error: "Failed to update application status",
    };
  }
}
