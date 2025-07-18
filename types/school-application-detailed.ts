export interface SchoolApplication {
  id: string;
  applicantName: string;
  country: string;
  workEmail: string;
  schoolName: string;
  phoneNumber: string;
  role: "PRINCIPAL" | "TEACHER" | "ADMIN" | "OTHER";
  schoolWebsite: string | null;
  numberOfStudents: number;
  productInterests: string[];
  painPoints: string;
  hearAboutUs: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  processedBy: string | null;
  processedAt: string | null;
  generatedSchoolId: string | null;
  schoolCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolApplicationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: SchoolApplication;
}

export interface UpdateStatusRequest {
  applicationId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}
