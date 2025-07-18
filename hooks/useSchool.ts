import { schoolService } from "@/services/school";
import type { SchoolFormData } from "@/types/school";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for school operations
export const schoolKeys = {
  all: ["schools"] as const,
  subdomain: (subdomain: string) =>
    [...schoolKeys.all, "subdomain", subdomain] as const,
};

// Hook for creating a school
export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SchoolFormData) => schoolService.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch any school-related queries
      queryClient.invalidateQueries({ queryKey: schoolKeys.all });

      console.log("School created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create school:", error);
    },
  });
}

// Hook for checking subdomain availability
export function useSubdomainAvailability(subdomain: string, enabled = true) {
  return useQuery({
    queryKey: schoolKeys.subdomain(subdomain),
    queryFn: () => schoolService.checkSubdomain(subdomain),
    enabled: enabled && subdomain.length >= 3,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

// Hook for manual subdomain checking (for real-time validation)
export function useCheckSubdomain() {
  return useMutation({
    mutationFn: (subdomain: string) => schoolService.checkSubdomain(subdomain),
  });
}
