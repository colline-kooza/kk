import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PaginationParams } from "./useDepartmentQueries";
import { subjectsServices } from "@/services/subjects";
import { CreateSubjectData, UpdateSubjectData } from "@/types/subjects-data";
import { toast } from "sonner";

export const subjectsKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectsKeys.all, "list"] as const,
  list: (filters: any) => [...subjectsKeys.lists(), { filters }] as const,
};

export function useSubjects(pagination: PaginationParams = {}) {
  const queryClient = useQueryClient();
  const subjectsQuery = useSuspenseQuery({
    queryKey: subjectsKeys.list({ pagination }),
    queryFn: () => {
      const data = subjectsServices.getAll(pagination);
      return data;
    },
  });

  const createSubjectQuery = useMutation({
    mutationFn: (data: CreateSubjectData) => subjectsServices.create(data),
    onSuccess: () => {
      toast.success("Subject added successfully");
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
    onError: (error: Error) => {
      toast.error("Failed to add subject", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
  return {
    allSubjects: subjectsQuery.data.data || [],
    error: subjectsQuery.error || "",
    refetch: subjectsQuery.refetch,
    isLoading: subjectsQuery.isPending,
    totalCount: subjectsQuery.data.meta.total,
    ...(subjectsQuery.data.meta.searchQuery && {
      searchQuery: subjectsQuery.data.meta.searchQuery,
    }),
    page: subjectsQuery.data.meta.pagination.page,
    limit: subjectsQuery.data.meta.pagination.limit,
    totalPages: subjectsQuery.data.meta.pagination.totalPages,

    //mutation
    createSubject: createSubjectQuery.mutateAsync,
    isCreating: createSubjectQuery.isPending,
  };
}

export function useUpdateSubject(id: string | null) {
  const queryClient = useQueryClient();
  const updateDepartmentQuery = useMutation({
    mutationFn: (data: UpdateSubjectData) => subjectsServices.update(data, id),
    onSuccess: () => {
      toast.success("Subject updated successfully");
      // Invalidate products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
    onError: (error: Error) => {
      toast.error("Failed to update subject", {
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
    updateSubject: updateDepartmentQuery.mutateAsync,
    // department: getSingleDepartment.data || null,
    isUpdating: updateDepartmentQuery.isPending,
  };
}
