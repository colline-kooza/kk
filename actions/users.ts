"use server";

import { api } from "@/config/api-client";
import { UserCreateProps, UserRole } from "@/types/auth";
// import { Staff, UserCreateProps, UserRole } from "@/types/types";

import axios from "axios";

import { revalidatePath } from "next/cache";

export async function createUser(data: UserCreateProps) {
  try {
    const response = await api.post("/register", data);
    revalidatePath("/dashboard/users");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Type-safe error handling
      const message = error.response?.data?.message || "Failed to create User";
      throw new Error(message);
    }
    throw error;
  }
}
export async function getProfileId(userId: string, role: UserRole) {
  try {
    const response = await api.get(`/users/${userId}?role=${role}`);
    const profileData = response.data;
    return profileData.id as string;
  } catch (error) {
    console.log(error);
  }
}
// export async function getStaffMembers(schoolId: string) {
//   try {
//     const response = await api.get(`/staff/${schoolId}`);
//     const users = response.data;
//     return users as Staff[];
//   } catch (error) {
//     console.log(error);
//   }
// }
