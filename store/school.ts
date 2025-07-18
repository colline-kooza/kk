// store/school.ts
"use client";

import { School } from "@/types/auth2";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SchoolState = {
  school: School | null;
  setSchool: (school: School | null) => void;
  clearSchool: () => void;
};

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      school: null,
      setSchool: (school) => set({ school }),
      clearSchool: () => set({ school: null }),
    }),
    {
      name: "school-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ school: state.school }),
    }
  )
);
