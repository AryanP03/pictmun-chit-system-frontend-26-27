import { axiosInstance } from "@/lib/axiosInstance";
import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
type AuthUserType = {
  id: string;
  username: string;
  portfolio: string;
  role: string;
  committee: string;
};

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // logic will go here
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        // if (!res.data.success) {
        //   throw new Error(res.data.error);
        // }
        setAuthUser(res.data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
