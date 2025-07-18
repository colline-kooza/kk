import { minteachersDataServices } from "@/services/min-teachers-data";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useMinTeachersData() {
  const allTeachersQuery = useSuspenseQuery({
    queryKey: ["minTeachersData"],
    queryFn: () => {
      const data = minteachersDataServices.getAll();
      return data;
    },
  });

  return {
    myTeachers: allTeachersQuery.data || [],
    isFetching: allTeachersQuery.isFetching,
    error: allTeachersQuery.error || "",
  };
}
