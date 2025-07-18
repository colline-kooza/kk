import { useQuery } from "@tanstack/react-query";
import type { RecentSchoolsFilters } from "@/types/dashboard";
import {
  getDashboardOverviewStats,
  getRecentSchoolsData,
} from "@/actions/superAdmin-dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  recentSchools: (filters: RecentSchoolsFilters) =>
    [...dashboardKeys.all, "recent-schools", filters] as const,
};

export function useDashboardOverviewStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const result = await getDashboardOverviewStats();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch dashboard stats");
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats: data || {
      totalSchools: 0,
      activeStudents: 0,
      pendingApplications: 0,
      totalUsers: 0,
    },
    isLoading,
    error: error?.message || null,
  };
}

export function useRecentSchools(filters: RecentSchoolsFilters = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: dashboardKeys.recentSchools(filters),
    queryFn: async () => {
      const result = await getRecentSchoolsData(filters);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch recent schools");
      }
      return result.data?.schools || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    schools: data || [],
    isLoading,
    error: error?.message || null,
  };
}
