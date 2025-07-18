// Form types based on Prisma schema
export enum ApplicationUserRole {
  PRINCIPAL = "PRINCIPAL",
  SCHOOL_ADMINISTRATOR = "SCHOOL_ADMINISTRATOR",
  IT_MANAGEMENT = "IT_MANAGEMENT",
  TEACHER = "TEACHER",
  PARENT = "PARENT",
  STUDENT = "STUDENT",
  CONSULTANT = "CONSULTANT",
  RESELLER = "RESELLER",
  OTHER = "OTHER",
}

export enum ProductInterest {
  ADMISSIONS = "ADMISSIONS",
  ASSIGNMENTS = "ASSIGNMENTS",
  ATTENDANCE = "ATTENDANCE",
  BILLING = "BILLING",
  FUNDRAISING = "FUNDRAISING",
  GRADEBOOK = "GRADEBOOK",
  LEARNING_MANAGEMENT = "LEARNING_MANAGEMENT",
  LESSON_PLANS = "LESSON_PLANS",
  LUNCH_COUNT = "LUNCH_COUNT",
  MASTER_SCHEDULER = "MASTER_SCHEDULER",
  PARENT_PORTAL = "PARENT_PORTAL",
  SCHEDULER = "SCHEDULER",
}

export interface EnquiryFormData {
  applicantName: string;
  country: string;
  workEmail: string;
  schoolName: string;
  phoneNumber: string;
  role: ApplicationUserRole;
  schoolWebsite: string | null;
  numberOfStudents: number;
  productInterests: ProductInterest[];
  painPoints: string;
  hearAboutUs: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
