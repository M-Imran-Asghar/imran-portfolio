import axios from "axios";

const baseURL = typeof window === "undefined"
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api`
  : "/api";

const api = axios.create({ baseURL });

export default api;
