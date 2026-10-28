import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axiosInstance";
import { type FormDataType } from "../pages/admin/CreateEntries";

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async (formData: FormDataType): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/admin/create", {
        username: formData.username.trim(),
        password: formData.password.trim(),
        portfolio: formData.portfolio.trim(),
        role: formData.role,
        committee: formData.committee,
        adminPass: "thisistheadminpassword",
      });

      if (response.data?.success || response.status === 201) {
        toast.success(
          `User "${formData.username}" created successfully as ${formData.role} in ${formData.committee}!`
        );
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating user:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    loading,
  };
};

export interface SystemUser {
  id: string;
  username: string;
  portfolio: string;
  role: "DELEGATE" | "EB" | "ADMIN";
  committee: string;
  createdAt: string;
}

export const useGetAllUsers = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/get-users");
      if (response.data?.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetchUsers: fetchUsers };
};
