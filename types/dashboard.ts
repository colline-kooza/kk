export interface DashboardStats {
  totalSchools: number;
  activeStudents: number;
  pendingApplications: number;
  totalUsers: number;
}

export interface RecentSchool {
  id: string;
  logo: string | null;
  name: string;
  status: "Active" | "Inactive" | "Pending";
  students: number;
}

export interface RecentSchoolsFilters {
  status?: "Active" | "Inactive" | "Pending";
  search?: string;
}
