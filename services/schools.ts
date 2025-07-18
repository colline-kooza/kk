import { getSchools, getSingleSchool } from "@/actions/schools";
import { PaginationParams, School, SchoolsResponse } from "@/types/schools";

interface SchoolServiceProps {
  getAll: (pagination: PaginationParams) => Promise<SchoolsResponse>;
  getSingle: (id: string) => Promise<School>;
}

export const schoolServices: SchoolServiceProps = {
  getAll: async (pagination: PaginationParams) => {
    const response = await getSchools(pagination);
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch schools");
    }
    return response.data;
  },
  getSingle: async (id: string) => {
    const response = await getSingleSchool(id);
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch school");
    }
    return response.data;
  },
};
