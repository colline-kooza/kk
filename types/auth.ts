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
  | "LIBRARIAN"
  | "RECEPTIONIST"
  | "ACCOUNTANT";
