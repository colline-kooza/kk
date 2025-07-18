"use server";

import { api } from "@/config/api-client";
import {
  DashboardStats,
  RecentSchool,
  RecentSchoolsFilters,
} from "@/types/dashboard";

export async function getDashboardOverviewStats(): Promise<{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}> {
  try {
    const response = await api.get("/dashboard/stats");
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error fetching dashboard overview stats:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch dashboard overview stats",
    };
  }
}

export async function getRecentSchoolsData(
  filters: RecentSchoolsFilters = {}
): Promise<{
  success: boolean;
  data?: { schools: RecentSchool[] };
  error?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    const queryString = params.toString();
    const url = `/dashboard/recent-schools${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await api.get(url);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error fetching recent schools:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch recent schools",
    };
  }
}
