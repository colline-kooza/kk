"use server";

import { api } from "@/config/api-client";
import { QueriesMinTeachersDataResponse } from "@/types/types";
import { getServerUser } from "./auth";

export async function getMinTeachersData(): Promise<QueriesMinTeachersDataResponse> {
  const user = await getServerUser();
  if (!user) {
    return {
      success: false,
      message: "User Not Available",
      data: [],
    };
  }
  try {
    const response = await api.get(`/minteachersData/${user.schoolId}`);
    const teachers = response.data.data;
    return {
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
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
