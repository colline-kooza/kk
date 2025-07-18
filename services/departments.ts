import {
  createDepartment,
  getDepartments,
  getMinDepartments,
  getSingleDepartment,
  updateDepartment,
} from "@/actions/departments";
import { PaginationParams } from "@/hooks/useDepartmentQueries";
import {
  CreateDepartmentData,
  DepartmentData,
  DepartmentsResponse,
  MinDepartmentData,
  UpdateDepartmentData,
} from "@/types/types";
interface DepServiceProps {
  getAll: (
    userId: string,
    pagination: PaginationParams
  ) => Promise<DepartmentsResponse>;
  getAllMin: (id: string) => Promise<MinDepartmentData[]>;
  getSingle: (id: string) => Promise<DepartmentData>;
  create: (
    data: CreateDepartmentData,
    userId: string
  ) => Promise<CreateDepartmentData>;
  update: (
    data: UpdateDepartmentData,
    id: string | null
  ) => Promise<UpdateDepartmentData | null>;
}

export const departmentServices: DepServiceProps = {
  getAll: async (userId: string, pagination: PaginationParams) => {
    const response = await getDepartments(userId, pagination);
    if (!response.success) {
      throw "Failed to fetch";
    }
    const data = response.data;
    const departmentObject: DepartmentsResponse = {
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
    return departmentObject;
  },
  getAllMin: async (id: string) => {
    const res = await getMinDepartments(id);
    const DepData = res.data;
    if (!DepData) {
      return [];
    }
    return DepData;
  },
  create: async (data: CreateDepartmentData, userId: string) => {
    const response = await createDepartment(data, userId);
    if (!response.success || !response.data) {
      throw "Failed to create";
    }
    const department = response.data as CreateDepartmentData;

    return department;
  },
  update: async (data: UpdateDepartmentData, id: string | null) => {
    if (!id) {
      console.log("id nt available");
      return null;
    }
    const response = await updateDepartment(data, id);
    if (!response.success || !response.data) {
      throw "Failed to create";
    }
    const department = response.data as UpdateDepartmentData;

    return department;
  },
  getSingle: async (id: string) => {
    const response = await getSingleDepartment(id);
    if (!response.success || !response.data) {
      throw "Failed to create";
    }
    const department = response.data as DepartmentData;

    return department;
  },
};
