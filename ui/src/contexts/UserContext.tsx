import { createContext, FC, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type User = {
  id?: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
  image: string | null;
};

type UserContextProps = {
  user: User | undefined;
  loading: boolean;
};

export const UserContext = createContext<UserContextProps>({
  user: {
    username: "",
    email: "",
    password: "",
    full_name: "",
    created_at: new Date(),
    updated_at: new Date(),
    image: null,
  },
  loading: true,
});

type UserProviderProps = {
  children: any;
};

export const whoami = async () => {
  try {
    const response = await axios.get(`/api/whoami`);
    return response.data;
  } catch (error) {}
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const {
    data: user,
    isFetching,
    isLoading,
  } = useQuery<User>({
    queryKey: ["whoami"],
    queryFn: () => whoami(),
  });

  const loading = useMemo(
    () => isFetching || isLoading,
    [isFetching, isLoading]
  );

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
