import { User, UserRole } from "@/types/auth";
// config/page-protection.ts
import { redirect } from "next/navigation";

export class PageProtection {
  /**
   * Checks if user has any of the specified roles
   * @param user - The user object
   * @param allowedRoles - Array of roles that are allowed access
   * @param redirectTo - Optional custom redirect path (defaults to /unauthorized)
   */
  static async checkRoles(
    user: User | null,
    allowedRoles: UserRole[],
    redirectTo: string = "/unauthorized"
  ): Promise<void> {
    // If no user is logged in, redirect to login
    if (!user) {
      redirect("/auth/login");
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user.role)) {
      redirect(redirectTo);
    }
  }

  /**
   * Allows access only to Super Admin
   */
  static async superAdminOnly(user: User | null): Promise<void> {
    await this.checkRoles(user, ["SUPER_ADMIN"]);
  }

  /**
   * Allows access to Super Admin and Admin
   */
  static async adminOnly(user: User | null): Promise<void> {
    await this.checkRoles(user, ["SUPER_ADMIN", "ADMIN"]);
  }

  /**
   * Allows access to administrative roles
   */
  static async administrativeRoles(user: User | null): Promise<void> {
    await this.checkRoles(user, ["SUPER_ADMIN", "ADMIN", "SECRETARY"]);
  }

  /**
   * Allows access to teaching staff
   */
  static async teachingStaff(user: User | null): Promise<void> {
    await this.checkRoles(user, ["SUPER_ADMIN", "ADMIN", "TEACHER"]);
  }

  /**
   * Allows access to all staff (excluding students and parents)
   */
  static async staffOnly(user: User | null): Promise<void> {
    await this.checkRoles(user, [
      "SUPER_ADMIN",
      "ADMIN",
      "TEACHER",
      "SECRETARY",
      "LIBRARIAN",
      "RECEPTIONIST",
      "ACCOUNTANT",
    ]);
  }

  /**
   * Allows access to students and parents only
   */
  static async studentsAndParents(user: User | null): Promise<void> {
    await this.checkRoles(user, ["STUDENT", "PARENT"]);
  }

  /**
   * Custom role checker - most flexible option
   */
  static async customRoles(
    user: User | null,
    allowedRoles: UserRole[],
    redirectTo?: string
  ): Promise<void> {
    await this.checkRoles(user, allowedRoles, redirectTo);
  }

  /**
   * Utility function to check if user has specific role without redirecting
   */
  static hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  /**
   * Utility function to check if user has any of the specified roles without redirecting
   */
  static hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Get user's role hierarchy level (higher number = more permissions)
   */
  static getRoleLevel(role: UserRole): number {
    const roleLevels: Record<UserRole, number> = {
      SUPER_ADMIN: 10,
      ADMIN: 9,
      TEACHER: 8,
      SECRETARY: 7,
      LIBRARIAN: 6,
      RECEPTIONIST: 5,
      ACCOUNTANT: 4,
      PARENT: 3,
      STUDENT: 2,
    };
    return roleLevels[role] || 0;
  }

  /**
   * Check if user has at least the specified role level
   */
  static async requireMinimumRole(
    user: User | null,
    minimumRole: UserRole,
    redirectTo?: string
  ): Promise<void> {
    if (!user) {
      redirect("/auth/login");
    }

    const userLevel = this.getRoleLevel(user.role);
    const requiredLevel = this.getRoleLevel(minimumRole);

    if (userLevel < requiredLevel) {
      redirect(redirectTo || "/unauthorized");
    }
  }
}
