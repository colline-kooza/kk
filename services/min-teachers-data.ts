import { getMinTeachersData } from "@/actions/min-teachers-data";
import {
  MinTeachersDataProps,
  QueriesMinTeachersDataResponse,
} from "@/types/types";

interface MinteachersDataServiceProps {
  getAll: () => Promise<MinTeachersDataProps[]>;
}

export const minteachersDataServices: MinteachersDataServiceProps = {
  getAll: async () => {
    const res = await getMinTeachersData();
    const teachersData = res.data;
    if (!teachersData) {
      return [];
    }
    return teachersData;
  },
};
