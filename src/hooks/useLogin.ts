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
    if (!username.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (!captchaToken.trim()) {
      toast.error("Please verify you are not a robot!");
      return;
    }

    username = username.trim();
    password = password.trim();
    captchaToken = captchaToken.trim();

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
      if (error.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
      } else if (error.status === 401) {
        toast.error("Invalid username or password.");
      } else if (error.status === 400) {
        toast.error("ReCAPTCHA verification failed. Please try again.");
      } else if (error.status === 404) {
        toast.error("User not found. Please check your username.");
      } else {
        toast.error(error.data.message || "Error in login");
      }
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
