import { departmentServices } from "@/services/departments";
import { CreateDepartmentData, UpdateDepartmentData } from "@/types/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters: any) => [...departmentKeys.lists(), { filters }] as const,
};

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSuspenseDepartments(
  userId: string,
  pagination: PaginationParams = {}
) {
  const queryClient = useQueryClient();
  const departmentsQuery = useSuspenseQuery({
    queryKey: departmentKeys.list({ userId, pagination }),
    queryFn: () => {
      const data = departmentServices.getAll(userId, pagination);
      return data;
    },
  });
  const minDepartmentsQuery = useSuspenseQuery({
    queryKey: departmentKeys.list({ userId }),
    queryFn: () => {
      const data = departmentServices.getAllMin(userId);
      return data;
    },
  });

  const createDepartmentQuery = useMutation({
    mutationFn: (data: CreateDepartmentData) =>
      departmentServices.create(data, userId),
    onSuccess: () => {
      toast.success("Department added successfully");
      // Invalidate products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
    onError: (error: Error) => {
      toast.error("Failed to add deprtment", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
  return {
    allDepartments: departmentsQuery.data.data || [],
    allMinDepartments: minDepartmentsQuery.data || [],
    error: departmentsQuery.error || "",
    refetch: departmentsQuery.refetch,
    isLoading: departmentsQuery.isPending,
    totalCount: departmentsQuery.data.meta.total,
    ...(departmentsQuery.data.meta.searchQuery && {
      searchQuery: departmentsQuery.data.meta.searchQuery,
    }),
    page: departmentsQuery.data.meta.pagination.page,
    limit: departmentsQuery.data.meta.pagination.limit,
    totalPages: departmentsQuery.data.meta.pagination.totalPages,

    //mutation
    createDepartment: createDepartmentQuery.mutateAsync,
    isCreating: createDepartmentQuery.isPending,
  };
}

export function useUpdateDepartment(id: string | null) {
  const queryClient = useQueryClient();
  const updateDepartmentQuery = useMutation({
    mutationFn: (data: UpdateDepartmentData) =>
      departmentServices.update(data, id),
    onSuccess: () => {
      toast.success("Department updated successfully");
      // Invalidate products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
    onError: (error: Error) => {
      toast.error("Failed to update deprtment", {
        description: error.message || "Unknown error occurred",
      });
    },
  });

  // const getSingleDepartment = useSuspenseQuery({
  //   queryKey: departmentKeys.all,
  //   queryFn: () => {
  //     const data = departmentServices.getSingle(id);
  //     return data;
  //   },
  // });

  return {
    updateDepartment: updateDepartmentQuery.mutateAsync,
    // department: getSingleDepartment.data || null,
    isUpdating: updateDepartmentQuery.isPending,
  };
}
