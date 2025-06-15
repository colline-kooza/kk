// store/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User interface based on your schema
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "TEACHER"
    | "RECEPTIONIST"
    | "ACCOUNTANT"
    | "LIBRARIAN"
    | "STUDENT"
    | "PARENT";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  isVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// School interface
export interface School {
  id: string;
  name: string;
  logo: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  address: string | null;
  website: string | null;
  establishedYear: number | null;
  motto: string | null;
  description: string | null;
  colors: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  // State
  user: User | null;
  school: School | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  setSchool: (school: School) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  updateSchool: (school: Partial<School>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      school: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setSchool: (school: School) => set({ school }),

      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken }),

      clearAuth: () =>
        set({
          user: null,
          school: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      updateSchool: (schoolData: Partial<School>) =>
        set((state) => ({
          school: state.school ? { ...state.school, ...schoolData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        school: state.school,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
