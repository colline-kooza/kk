import { useQuery } from "@tanstack/react-query";
import type { SchoolsFilters } from "@/types/schools";
import { schoolServices } from "@/services/schools";

export const schoolKeys = {
  all: ["schools"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  list: (filters: SchoolsFilters) =>
    [...schoolKeys.lists(), { filters }] as const,
};

export function useSchools(filters: SchoolsFilters = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: schoolKeys.list({ ...filters }),
    queryFn: () => schoolServices.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    schools: data?.schools || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    stats: data?.stats || {
      total: 0,
      active: 0,
      inactive: 0,
      byEstablishedYear: {},
      withAdmin: 0,
      withoutAdmin: 0,
      totalStudents: 0,
      averageStudentsPerSchool: 0,
    },
    isLoading,
    error: error?.message || null,
    refetch,
  };
}
