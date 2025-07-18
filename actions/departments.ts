"use server";

import { api } from "@/config/api-client";
import { PaginationParams } from "@/hooks/useDepartmentQueries";
import {
  CreateDepartmentData,
  MutationDepartmentResponse,
  QueriesDepartmentResponse,
  QueriesMinDepartmentResponse,
  SingleQueryDepartmentResponse,
  UpdateDepartmentData,
} from "@/types/types";

export async function getDepartments(
  userId: string,
  pagination: PaginationParams
): Promise<QueriesDepartmentResponse> {
  if (!userId) {
    console.log("user id not aailable");
    return {
      success: false,
      error: "User Id not available",
      data: null,
    };
  }
  try {
    const response = await api.get(
      `/departments?userId=${userId}&page=${pagination.page || 1}&limit=${
        pagination.limit || 10
      }&${pagination.search && `search=${pagination.search}`}`
    );
    const departments = response.data;
    return {
      success: true,
      message: "Departments fetched successfully",
      data: departments,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: null,
    };
  }
}
export async function getMinDepartments(
  userId: string
): Promise<QueriesMinDepartmentResponse> {
  if (!userId) {
    console.log("user id not aailable");
    return {
      success: false,
      error: "User Id not available",
      data: [],
    };
  }
  try {
    const response = await api.get(`/mindepartments?userId=${userId}`);
    const departments = response.data.data;
    return {
      success: true,
      message: "Departments fetched successfully",
      data: departments,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: [],
    };
  }
}
export async function getSingleDepartment(
  id: string
): Promise<SingleQueryDepartmentResponse> {
  if (!id) {
    console.log("id not available");
    return {
      success: false,
      error: "User Id not available",
      data: null,
    };
  }
  try {
    const response = await api.get(`/departments/${id}`);
    const department = response.data;
    return {
      success: true,
      message: "Department fetched successfully",
      data: department,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: null,
    };
  }
}

export async function createDepartment(
  data: CreateDepartmentData,
  userId: string
): Promise<MutationDepartmentResponse> {
  if (!userId) {
    return {
      success: false,
      message: "user id is missing.",
      data: null,
    };
  }
  try {
    const response = await api.post(`/departments?userId=${userId}`, data);
    return {
      success: true,
      message: "Department created successfully",
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: null,
    };
  }
}

export async function updateDepartment(
  data: UpdateDepartmentData,
  id: string
): Promise<MutationDepartmentResponse> {
  if (!id) {
    return {
      success: false,
      message: "id is missing.",
      data: null,
    };
  }
  try {
    const response = await api.patch(`/departments/${id}`, data);
    return {
      success: true,
      message: "Department updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Something went wrong",
      data: null,
    };
  }
}
