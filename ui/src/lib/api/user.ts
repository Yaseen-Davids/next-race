import { useApiPost } from "./base";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export const useLogin = () =>
  useApiPost<{ username: string; password: string }>({
    endpoint: "/login",
    queryKey: "users",
  });
