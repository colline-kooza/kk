export interface SubjectData {
  id: string;
  name: string;
  slug: string;
  code: string;
  shortName: string;
  type: "BOTH" | "THEORY" | "PRACTICAL";
  createdAt: Date;
  departmentId: string;
}

export interface CreateSubjectData
  extends Omit<SubjectData, "id" | "createdAt" | "slug"> {}

export interface UpdateSubjectData extends Partial<CreateSubjectData> {}

export interface SubjectsResponse {
  data: SubjectData[] | [];
  meta: {
    total: number | 0;
    searchQuery?: string;
    pagination: {
      page: number | 1;
      limit: number | 10;
      totalPages: number | 0;
    };
  };
}

export interface QueriesSubjectsResponse {
  success: boolean;
  data: SubjectsResponse | null;
  error?: string;
  message?: string;
}

export interface SingleQueryDepartmentResponse {
  success: boolean;
  data: SubjectData | null;
  error?: string;
  message?: string;
}

export interface MutationSubjectResponse {
  success: boolean;
  data?: SubjectData | null;
  error?: string;
  message?: string;
}
