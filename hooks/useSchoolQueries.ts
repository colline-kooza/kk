// hooks/useSchoolQueries.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { School } from "@/types/auth2";
import type {
  SchoolFormData,
  SubdomainAvailabilityResponse,
} from "@/types/school";
import { extractSubdomainFromHost, isValidSubdomain } from "@/utils/utils";
import { schoolService } from "@/services/school";

export const schoolQueryKeys = {
  all: ["schools"] as const,
  bySubdomain: (subdomain: string) =>
    [...schoolQueryKeys.all, "subdomain", subdomain] as const,
  current: () => [...schoolQueryKeys.all, "current"] as const,
  subdomainCheck: (subdomain: string) =>
    [...schoolQueryKeys.all, "subdomain-check", subdomain] as const,
};

export function useSchoolBySubdomain(subdomain: string | null) {
  return useQuery({
    queryKey: schoolQueryKeys.bySubdomain(subdomain || ""),
    queryFn: () => {
      if (!subdomain || !isValidSubdomain(subdomain)) {
        return Promise.resolve(null);
      }
      return schoolService.getBySubdomain(subdomain);
    },
    enabled: Boolean(subdomain && isValidSubdomain(subdomain)),
    staleTime: 30 * 60 * 1000, // 30 minutes - schools don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      // Don't retry on certain errors
      if (error instanceof Error && error.message.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCurrentSchool() {
  const subdomain =
    typeof window !== "undefined"
      ? extractSubdomainFromHost(window.location.host)
      : null;

  return useSchoolBySubdomain(subdomain);
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SchoolFormData) => schoolService.create(data),
    onSuccess: (response) => {
      // Invalidate and refetch school queries
      queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.all,
      });

      // If we have the subdomain, cache the new school
      if (response.data?.subdomain) {
        queryClient.setQueryData(
          schoolQueryKeys.bySubdomain(response.data.subdomain),
          response.data
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create school:", error);
    },
  });
}

export function useCheckSubdomain(subdomain: string) {
  return useQuery({
    queryKey: schoolQueryKeys.subdomainCheck(subdomain),
    queryFn: () => schoolService.checkSubdomain(subdomain),
    enabled: Boolean(subdomain && subdomain.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry subdomain checks
  });
}

export function useSchoolCache() {
  const queryClient = useQueryClient();

  const prefetchSchool = async (subdomain: string) => {
    if (!subdomain || !isValidSubdomain(subdomain)) return;

    await queryClient.prefetchQuery({
      queryKey: schoolQueryKeys.bySubdomain(subdomain),
      queryFn: () => schoolService.getBySubdomain(subdomain),
      staleTime: 30 * 60 * 1000,
    });
  };

  const invalidateSchool = (subdomain?: string) => {
    if (subdomain) {
      queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.bySubdomain(subdomain),
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.all,
      });
    }
  };

  const setSchoolCache = (subdomain: string, school: School) => {
    queryClient.setQueryData(schoolQueryKeys.bySubdomain(subdomain), school);
  };

  const prefetchSubdomainCheck = async (subdomain: string) => {
    if (!subdomain) return;

    await queryClient.prefetchQuery({
      queryKey: schoolQueryKeys.subdomainCheck(subdomain),
      queryFn: () => schoolService.checkSubdomain(subdomain),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    prefetchSchool,
    invalidateSchool,
    setSchoolCache,
    prefetchSubdomainCheck,
  };
}
