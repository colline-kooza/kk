// store/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, School, AuthStore } from "@/types/login";

interface AuthState extends AuthStore {
  // Additional helper methods
  initialize: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      school: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      setSchool: (school: School) => {
        set({ school });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        console.log("Setting tokens in store");
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          school: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userUpdate: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userUpdate };
          set({ user: updatedUser });
        }
      },

      updateSchool: (schoolUpdate: Partial<School>) => {
        const currentSchool = get().school;
        if (currentSchool) {
          const updatedSchool = { ...currentSchool, ...schoolUpdate };
          set({ school: updatedSchool });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: () => {
        // This method can be called to initialize the store from server-side data
        // if needed (e.g., during SSR or after page refresh)
        console.log("Initializing auth store");
      },
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
