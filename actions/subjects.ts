"use server";

import { api } from "@/config/api-client";
import { PaginationParams } from "@/hooks/useDepartmentQueries";
import {
  CreateSubjectData,
  MutationSubjectResponse,
  QueriesSubjectsResponse,
  UpdateSubjectData,
} from "@/types/subjects-data";
import { getServerUser } from "./auth";

export async function getSubjects(
  pagination: PaginationParams
): Promise<QueriesSubjectsResponse> {
  const user = await getServerUser();
  if (!user) {
    console.log("user id not available");
    return {
      success: false,
      error: "User Id not available",
      data: null,
    };
  }
  try {
    const response = await api.get(
      `/subjects?userId=${user.id}&page=${pagination.page || 1}&limit=${
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

export async function createSubject(
  data: CreateSubjectData
): Promise<MutationSubjectResponse> {
  const user = await getServerUser();
  if (!user) {
    return {
      success: false,
      message: "user id is missing.",
      data: null,
    };
  }
  try {
    const response = await api.post(`/subjects?userId=${user.id}`, data);

    return {
      success: true,
      message: "Subject created successfully",
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

export async function updateSubject(
  data: UpdateSubjectData,
  id: string
): Promise<MutationSubjectResponse> {
  if (!id) {
    return {
      success: false,
      message: "id is missing.",
      data: null,
    };
  }
  try {
    const response = await api.patch(`/subjects/${id}`, data);
    return {
      success: true,
      message: "Subject updated successfully",
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
