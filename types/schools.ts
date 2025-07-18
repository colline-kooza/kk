export interface School {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  address: string | null;
  website: string | null;
  establishedYear: number | null;
  slogan: string | null;
  description: string | null;
  isActive: boolean;
  adminId: string | null;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  establishedYear?: string;
  hasAdmin?: string;
}

export interface SchoolsFilters extends PaginationParams {
  userId?: string;
}

export interface SchoolsResponse {
  schools: School[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
    byEstablishedYear: Record<string, number>;
    withAdmin: number;
    withoutAdmin: number;
    totalStudents: number; // Added total students across all schools
    averageStudentsPerSchool: number; // Added average students per school
  };
}

export interface QueriesSchoolResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: SchoolsResponse | null;
}

export interface SingleQuerySchoolResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: School | null;
}

export interface CreateSchoolData {
  name: string;
  code: string;
  logo?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  address?: string;
  website?: string;
  establishedYear?: number;
  slogan?: string;
  description?: string;
}

export interface UpdateSchoolData {
  name?: string;
  code?: string;
  logo?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  address?: string;
  website?: string;
  establishedYear?: number;
  slogan?: string;
  description?: string;
  isActive?: boolean;
}
