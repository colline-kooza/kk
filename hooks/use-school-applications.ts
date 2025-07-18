import {
  schoolApplicationDetailService,
  schoolApplicationsServices,
} from "@/services/school-applications";
import { UpdateStatusRequest } from "@/types/school-application-detailed";
import type { SchoolApplicationsFilters } from "@/types/school-applications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const schoolApplicationsKeys = {
  all: ["school-applications"] as const,
  lists: () => [...schoolApplicationsKeys.all, "list"] as const,
  list: (filters: SchoolApplicationsFilters) =>
    [...schoolApplicationsKeys.lists(), { filters }] as const,
};

export function useSchoolApplications(filters: SchoolApplicationsFilters = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: schoolApplicationsKeys.list(filters),
    queryFn: () => schoolApplicationsServices.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    applications: data?.applications || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    stats: data?.stats || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      byCountry: {},
      byRole: {},
    },
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export const schoolApplicationDetailKeys = {
  all: ["school-application-detail"] as const,
  detail: (id: string) => [...schoolApplicationDetailKeys.all, id] as const,
};

export function useSchoolApplicationDetail(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: schoolApplicationDetailKeys.detail(id),
    queryFn: () => schoolApplicationDetailService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });

  return {
    application: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateStatusRequest) =>
      schoolApplicationDetailService.updateStatus(request),
    onSuccess: (data) => {
      queryClient.setQueryData(
        schoolApplicationDetailKeys.detail(data.id),
        data
      );
      queryClient.invalidateQueries({
        queryKey: schoolApplicationDetailKeys.all,
      });
    },
  });
}
