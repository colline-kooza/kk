// import { School } from "@/types/types";
import { School } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SchoolState = {
  school: School | null;
  setSchool: (school: School | null) => void;
};

const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      school: null,
      setSchool: (school) => set({ school }),
    }),
    {
      name: "school-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        school: state.school,
      }),
    }
  )
);

export default useSchoolStore;
