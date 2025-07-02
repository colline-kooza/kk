// components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getServerUser, getServerSchool } from "@/actions/auth";
import { getSchool, getServerAuthData } from "@/actions/login";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setSchool, clearAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have server-side authentication
        const serverUser = await getServerAuthData();
        const serverSchool = await getSchool();

        if (serverUser) {
          // Update client state with server data
          if (serverUser.user) {
            setUser(serverUser.user);
          }

          if (serverSchool) {
            setSchool(serverSchool);
          }
        } else {
          // No server session, clear client state
          clearAuth();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setSchool, clearAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !user) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        router.push("/unauthorized");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, requiredRoles, router, redirectTo]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Role-based component visibility
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGate({
  children,
  allowedRoles,
  fallback = null,
}: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
