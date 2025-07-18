import { API_BASE_URL } from "@/lib/enviroment";
import axios from "axios";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
