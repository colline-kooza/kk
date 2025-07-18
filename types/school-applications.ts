export interface SchoolApplication {
  id: string;
  applicantName: string;
  country: string;
  schoolName: string;
  numberOfStudents: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "STUDENT" | "PRINCIPAL" | "IT_MANAGEMENT" | "SCHOOL_ADMINISTRATOR";
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolApplicationsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SchoolApplicationsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byCountry: Record<string, number>;
  byRole: Record<string, number>;
}

export interface SchoolApplicationsResponse {
  applications: SchoolApplication[];
  pagination: SchoolApplicationsPagination;
  stats: SchoolApplicationsStats;
}

export interface SchoolApplicationsFilters {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  country?: string;
  search?: string;
}

export interface QueriesSchoolApplicationsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: SchoolApplicationsResponse;
}
