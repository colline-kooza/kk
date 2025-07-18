export type Contact = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  country: string;
  schoolPage: string;
  students: number;
  role: string;
  media: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};
export type Parent = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  relationship: string;
  email: string;
  NIN: string;
  gender: string;
  dob: string;
  phone: string;
  nationality: string;
  whatsapNo: string;
  imageUrl: string;
  contactMethod: string;
  occupation: string;
  address: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};
export type Staff = {
  id: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassCreateProps = {
  title: string;
  schoolId: string;
};
export type DepartmentCreateProps = {
  name: string;
  schoolId: string;
};
// export interface SubjectDetail {
//   id: string;
//   name: string;
//   code: string;
//   shortName?: string;
//   type: SubjectType;
//   category: SubjectCategory;
//   departmentName: string;
//   departmentId: string;
//   passingMarks?: number;
//   totalMarks?: number;
//   isActive: boolean;
//   isOptional: boolean;
//   hasTheory: boolean;
//   hasPractical: boolean;
//   labRequired: boolean;
//   teacherId: string;
//   teacherName: string;
// }
export type SubjectCreateProps = {
  name: string;
  code: string; // e.g., "MATH101", "PHY201"
  shortName: string; // e.g., "Math", "Phy"
  category: string; // Core, Elective, etc.
  type: string; // Theory, Practical, Both
  departmentId: string;
  departmentName: string;
};

export type StreamCreateProps = {
  title: string;
  classId: string;
  schoolId: string;
};
export type AssignClassTeacherProps = {
  classTeacherId: string;
  classId: string;
  classTeacherName: string;
  oldClassTeacherId: string | null | undefined;
};

// export type Class = {
//   id: string;
//   title: string;
//   slug: string;
//   streams: Stream[];
//   students: Student[];
//   createdAt: string;
//   updatedAt: string;
// };
export type Class = {
  id: string;
  title: string;
  slug: string;
  classTeacherId: string | null;
  classTeacherName: string | null;
  streams: StreamWithCount[];
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
  // subjects: SubjectDetail[];
};
export type UserLog = {
  id: string;
  name: string;
  activity: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  device?: string;
  schoolId: string;
};
export type Department = {
  id: string;
  name: string;
  slug: string;
  hodId?: string;
  hodName?: string;
  hodStartDate?: string;
  budget?: number;
  budgetYear?: string;
  teachers: StreamWithCount[];
  subjects: StreamWithCount[];
  createdAt: string;
  updatedAt: string;
};
export interface Period {
  id: string;
  year: number;
  term: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  schoolId: string;
}

export interface GroupedPeriods {
  [year: string]: Period[];
}
export type DepartmentBrief = {
  id: string;
  name: string;
};
export type ClassBrief = {
  id: string;
  title: string;
};
export type SubjectBrief = {
  id: string;
  name: string;
};

export type StreamWithCount = {
  id: string;
  title: string;
  slug: string;
  classId: string;
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
};
export type Stream = {
  id: string;
  title: string;
  slug: string;
  classId: string;
  class: Class;
  createdAt: Date;
  updatedAt: Date;
};
export interface MarkSheetStudent {
  id: string;
  name: string;
}
export interface MarkSheetResponse {
  students: MarkSheetStudent[];
  markSheetId: string;
}
export type CreateMarkSheetProps = {
  examId: string;
  title: string;
  classId: string;
  subjectId: string;
  markSheetId: string;
  termId: string;
};
export type UpdateMarkSheetProps = {
  examId: string;
  classId: string;
  subjectId: string;
  markSheetId: string;
  termId: string;
  studentMarks: {
    studentId: string;
    marks: number | null;
    isAbsent: boolean;
    comments: string;
  }[];
};
export type Student = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  classId: string;
  streamId: string;
  parentName?: string;
  classTitle?: string;
  streamTitle?: string;
  guardian?: Guardian;
  password: string;
  imageUrl: string;
  phone: string;
  state: string;
  BCN: string;
  nationality: string;
  religion: string;
  gender: string;
  dob: string;
  rollNo: string;
  regNo: string;
  admissionDate: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};
export interface Guardian {
  studentId: string;
  id: string;
  // Father's Details
  fatherFullName: string;
  fatherOccupation: string;
  fatherPhoneNumber: string;
  fatherEmail: string;
  fatherOfficeAddress: string;
  isPrimaryGuardian: boolean;

  // Mother's Details
  motherFullName: string;
  motherOccupation: string;
  motherPhoneNumber: string;
  motherEmail: string;
  motherOfficeAddress: string;
  isSecondaryGuardian: boolean;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  isLocalGuardian: boolean;
  createdAt: string;
  updatedAt: string;
}

// export enum SubjectCategory {
//   CORE = "CORE",
//   ELECTIVE = "ELECTIVE",
//   ADDITIONAL = "ADDITIONAL",
//   VOCATIONAL = "VOCATIONAL",
//   LANGUAGE = "LANGUAGE",
//   EXTRA_CURRICULAR = "EXTRA_CURRICULAR",
// }

// export enum SubjectType {
//   THEORY = "THEORY",
//   PRACTICAL = "PRACTICAL",
//   BOTH = "BOTH",
// }

// Department interface (referenced in Subject)

// Main Subject interface
// export interface Subject {
//   id: string;
//   createdAt: string;
//   updatedAt: string;

//   // Basic Information
//   name: string;
//   slug: string;
//   code: string;
//   shortName?: string;

//   // Academic Details
//   category: SubjectCategory;
//   type: SubjectType;
//   passingMarks?: number;
//   totalMarks?: number;
//   departmentId: string;
//   departmentName: string;
//   department: Department;

//   // Additional Settings
//   isActive: boolean;
//   isOptional: boolean;
//   hasTheory: boolean;
//   hasPractical: boolean;
//   labRequired: boolean;
// }
export type TeacherCreateProps = {
  title: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNo: string;
  nationality: string;
  NIN: string;
  gender: string;
  dateOfBirth: string;

  contactMethod: string;
  password: string;
  dateOfJoining: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  mainSubject: string;
  mainSubjectId: string;
  subjectsSummary: string[];
  classIds: string[];
  classes: string[];
  experience: number;
  address: string;
  imageUrl: string;
  schoolId: string;
  schoolName: string;
};
export interface Teacher {
  // Basic Identifiers
  id: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;

  // Personal Information
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  imageUrl: string;
  NIN: string; // National Identification Number
  bio?: string | null;

  // Contact Information
  email: string;
  phone: string;
  whatsappNo: string;
  address: string;
  contactMethod: string;

  // Emergency Contact
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;

  // Employment Details
  dateOfJoining: Date;
  designation: string;
  departmentName: string;
  departmentId: string;
  isActive: boolean;
  lastLogin: string | null;
  password: string;

  // Academic Details
  qualification: string;
  experience: number;
  skills?: string[] | null;
  mainSubject: string;
  mainSubjectId: string;
  // Class Assignment
  classes: string[];
  classIds: string[];
}
export interface BriefTeacher {
  // Basic Identifiers
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isClassTeacher: boolean;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
  phone?: string | null;
  schoolId?: string | null;
  schoolName?: string | null;
}
export type School = {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
  sectionCount: number;
  siteEnabled: boolean;
  siteCompletion: number;
};
export type UserCreateProps = {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  image?: string;
  schoolId?: string;
  schoolName?: string;
};
export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "SECRETARY"
  | "LIBRARIAN";
export type PeriodCreateProps = {
  year: number;
  term: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  schoolId: string;
};

export interface CreateSchoolFeePaymentInput {
  schoolName: string;
  schoolId: string;
  periodId: string;
  schoolFeeId: string;
  studentProfileId: string;
  studentUserId: string;
  studentName: string;
  parentProfileId: string;
  parentUserId: string;
  parentName: string;
  schoolFeeTitle: string;
  paidFeeAmount: number;
  paidFees: string[];
  PRN: string;
  term: string;
  year: number;
  className: string;
  // paymentStatus: "PENDING" | "APPROVED" | "FAILED";
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  FAILED = "FAILED",
}
export type UserLogCreateProps = {
  name: string;
  activity: string;
  time: string;
  ipAddress?: string;
  device?: string;
  schoolId: string;
};
// Main payment interface
export interface Payment {
  id: string;
  studentUserId: string;
  studentName: string;
  paidFeeAmount: number;
  paidFees: string[];
  PRN: string;
  paymentStatus: PaymentStatus;
  term: string;
  year: number;
  className: string;
}
export type Exam = {
  id: string;
  title: string;
  examType: "REGULAR" | "MOCK" | "PLACEMENT";
  examCategory: "TERM_START" | "MID_TERM" | "END_TERM";
  termName: number;
  academicYear: string;
  startDate: string;
};
export type RecentActivity = {
  id: string;
  activity: string;
  description: string;
  read: boolean;
  createdAt: string;
  time: string;
};
export type GalleryImageDTO = {
  id: string;
  schoolId: string;
  title: string;
  description?: string;
  image: string;
  date?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};
export interface GalleryImageCreateDTO {
  schoolId: string;
  title: string;
  description?: string;
  image: string;
  date?: string;
  categoryId: string;
}
export interface GalleryCategory {
  id: string;
  name: string;
}

export type Section = {
  id: string;
  schoolId: string;
  type: string;
  isComplete: boolean;
  title: string;
  subtitle?: string | null;
  isActive: boolean;
  order: number;
  settings: any;
  createdAt: Date;
  updatedAt: Date;
};
export interface News {
  id: string;
  schoolId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  image: string;
  content: string;
}
export interface EventData {
  id: string;
  schoolId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  hodName: string;
  hodId: string;
  slug: string;
  createdAt: Date;
}

export interface MinDepartmentData
  extends Omit<DepartmentData, "createdAt" | "slug" | "hodId" | "hodName"> {}
export interface CreateDepartmentData
  extends Omit<
    DepartmentData,
    "id" | "createdAt" | "hodName" | "slug" | "hodId"
  > {}

export interface UpdateDepartmentData {
  name?: string;
  hodName?: string;
  hodId?: string;
}

export interface DepartmentsResponse {
  data: DepartmentData[] | [];
  meta: {
    total: number | 0;
    searchQuery?: string;
    pagination: {
      page: number | 1;
      limit: number | 10;
      totalPages: number | 0;
    };
  };
}

export interface QueriesDepartmentResponse {
  success: boolean;
  data: DepartmentsResponse | null;
  error?: string;
  message?: string;
}
export interface QueriesMinDepartmentResponse {
  success: boolean;
  data: MinDepartmentData[] | [];
  error?: string;
  message?: string;
}

export interface SingleQueryDepartmentResponse {
  success: boolean;
  data: DepartmentData | null;
  error?: string;
  message?: string;
}

export interface MutationDepartmentResponse {
  success: boolean;
  data?: DepartmentData | null;
  error?: string;
  message?: string;
}

export interface MinTeachersDataProps {
  id: string;
  name: string;
}

export interface QueriesMinTeachersDataResponse {
  success: boolean;
  data: MinTeachersDataProps[] | [];
  error?: string;
  message?: string;
}
