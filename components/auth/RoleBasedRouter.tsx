// components/auth/RoleBasedRouter.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface RoleBasedRouterProps {
  children: React.ReactNode;
}

export function RoleBasedRouter({ children }: RoleBasedRouterProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/auth/login");
      return;
    }

    // Route based on user role
    const currentPath = window.location.pathname;

    // Don't redirect if already on the correct page
    if (
      currentPath.includes("/onboarding") ||
      currentPath.includes("/dashboard")
    ) {
      return;
    }

    // Route SUPER_ADMIN to onboarding, others to dashboard
    if (user.role === "SUPER_ADMIN") {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }, [user, isAuthenticated, router]);

  return <>{children}</>;
}

// Dashboard routing based on roles
export function DashboardRouter() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const currentPath = window.location.pathname;

    // If already on a specific dashboard page, don't redirect
    if (currentPath !== "/dashboard") return;

    // Route to role-specific dashboard sections
    switch (user.role) {
      case "SUPER_ADMIN":
        router.push("/dashboard/admin");
        break;
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "TEACHER":
        router.push("/dashboard/teacher");
        break;
      case "STUDENT":
        router.push("/dashboard/student");
        break;
      case "PARENT":
        router.push("/dashboard/parent");
        break;
      case "RECEPTIONIST":
        router.push("/dashboard/reception");
        break;
      case "ACCOUNTANT":
        router.push("/dashboard/finance");
        break;
      case "LIBRARIAN":
        router.push("/dashboard/library");
        break;
      default:
        router.push("/dashboard/overview");
    }
  }, [user, router]);

  return null;
}

// Component to show different content based on user role
interface RoleBasedContentProps {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedContent({
  role,
  children,
  fallback = null,
}: RoleBasedContentProps) {
  const { user } = useAuthStore();

  if (!user || user.role !== role) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Multi-role content component
interface MultiRoleContentProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function MultiRoleContent({
  allowedRoles,
  children,
  fallback = null,
}: MultiRoleContentProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
