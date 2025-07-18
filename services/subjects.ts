import { createSubject, getSubjects, updateSubject } from "@/actions/subjects";
import { PaginationParams } from "@/hooks/useDepartmentQueries";
import {
  CreateSubjectData,
  SubjectsResponse,
  UpdateSubjectData,
} from "@/types/subjects-data";

type SubjectServicesProps = {
  getAll: (pagination: PaginationParams) => Promise<SubjectsResponse>;
  create: (data: CreateSubjectData) => Promise<CreateSubjectData>;
  update: (
    data: UpdateSubjectData,
    id: string | null
  ) => Promise<UpdateSubjectData | null>;
};

export const subjectsServices: SubjectServicesProps = {
  getAll: async (pagination: PaginationParams) => {
    const response = await getSubjects(pagination);
    if (!response.success) {
      throw "Failed to fetch";
    }
    const data = response.data;
    const subjectObject: SubjectsResponse = {
      data: data?.data || [],
      meta: {
        total: data?.meta.total || 0,
        ...(data?.meta.searchQuery && { searchQuery: data?.meta.searchQuery }),
        pagination: {
          page: data?.meta.pagination.page || 1,
          limit: data?.meta.pagination.limit || 10,
          totalPages: data?.meta.pagination.totalPages || 0,
        },
      },
    };
    return subjectObject;
  },
  create: async (data: CreateSubjectData) => {
    const response = await createSubject(data);
    if (!response.success || !response.data) {
      throw "Failed to create";
    }
    const subject = response.data as CreateSubjectData;

    return subject;
  },
  update: async (data: UpdateSubjectData, id: string | null) => {
    if (!id) {
      console.log("id nt available");
      return null;
    }
    const response = await updateSubject(data, id);
    if (!response.success || !response.data) {
      throw "Failed to update";
    }
    const subject = response.data as UpdateSubjectData;

    return subject;
  },
};
