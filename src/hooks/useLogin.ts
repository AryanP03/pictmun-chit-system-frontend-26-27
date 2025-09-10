import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "sonner";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  /**
   * Login function
   * @param username - user's username
   * @param password - user's password
   * @param captchaToken - token from Google reCAPTCHA
   */
  const login = async (
    username: string,
    password: string,
    captchaToken: string
  ) => {
    if (!username || !password) {
      toast.error("All fields are required");
      return;
    }

    if (!captchaToken) {
      toast.error("Please verify you are not a robot!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
        captchaToken, // send captcha token to backend
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Error in login");
        console.error(res.data.message);
        return;
      }

      setAuthUser(res.data.user);
      toast.success("Login success");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
