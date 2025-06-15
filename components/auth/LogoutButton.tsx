// components/auth/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAuthStore } from "@/store/auth";
import { logout } from "@/actions/auth";
import { createLogoutLog } from "@/actions/user-logs";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showText?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  showText = true,
  className = "",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const { deviceInfo } = useDeviceInfo();
  const router = useRouter();

  const handleLogout = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Create logout log before clearing auth
      await createLogoutLog(user.id, user.name, deviceInfo);

      // Clear server session
      const result = await logout();

      if (result.success) {
        // Clear client state
        clearAuth();

        toast.success("Logged out successfully", {
          description: "You have been securely logged out.",
        });

        // Redirect to login
        router.push("/auth/login");
      } else {
        toast.error("Logout failed", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          {showText && <span className="ml-2">Logout</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will need to sign in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Logging out...</span>
              </div>
            ) : (
              "Logout"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Simple logout button without confirmation dialog
export function QuickLogoutButton({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleQuickLogout = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Create logout log
      await createLogoutLog(user.id, user.name);

      // Clear server session
      await logout();

      // Clear client state
      clearAuth();

      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error("Quick logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleQuickLogout}
      disabled={isLoading}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
