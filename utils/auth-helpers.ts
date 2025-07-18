"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Client-side helper to handle super admin redirects
export function useSuperAdminRedirect() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const response = await fetch("/api/auth/check-redirect", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.shouldRedirect && data.targetUrl) {
            setIsRedirecting(true);
            window.location.href = data.targetUrl;
          }
        }
      } catch (error) {
        console.error("Redirect check error:", error);
      }
    };

    checkRedirect();
  }, []);

  return { isRedirecting };
}

// Helper to get current user role from client-side
export function getCurrentUserRole(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user=")
  );

  if (!userCookie) return null;

  try {
    const userData = decodeURIComponent(userCookie.split("=")[1]);
    const user = JSON.parse(userData);
    return user.role;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return null;
  }
}

// Enhanced logout function for client-side
export async function clientLogout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Small delay to ensure server-side cleanup
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Force reload to clear any cached state
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Force redirect even on error
    window.location.href = "/auth/login";
  }
}
