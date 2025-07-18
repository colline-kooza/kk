import {
  getSchoolApplication,
  getSchoolApplications,
  updateApplicationStatus,
} from "@/actions/school-applcations";
import {
  SchoolApplication,
  UpdateStatusRequest,
} from "@/types/school-application-detailed";
import type {
  SchoolApplicationsResponse,
  SchoolApplicationsFilters,
} from "@/types/school-applications";

interface SchoolApplicationsServiceProps {
  getAll: (
    filters?: SchoolApplicationsFilters
  ) => Promise<SchoolApplicationsResponse>;
}
interface SchoolApplicationDetailServiceProps {
  getById: (id: string) => Promise<SchoolApplication>;
  updateStatus: (request: UpdateStatusRequest) => Promise<SchoolApplication>;
}
export const schoolApplicationsServices: SchoolApplicationsServiceProps = {
  getAll: async (filters?: SchoolApplicationsFilters) => {
    const response = await getSchoolApplications(filters);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch school applications");
    }
    return response.data;
  },
};

export const schoolApplicationDetailService: SchoolApplicationDetailServiceProps =
  {
    getById: async (id: string) => {
      const response = await getSchoolApplication(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch school application");
      }
      return response.data;
    },

    updateStatus: async (request: UpdateStatusRequest) => {
      const response = await updateApplicationStatus(request);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to update application status"
        );
      }
      return response.data;
    },
  };
