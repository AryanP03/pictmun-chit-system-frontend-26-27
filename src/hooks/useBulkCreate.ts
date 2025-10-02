import { useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

interface BulkCreateResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useBulkCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkCreate = async (csvFile: File): Promise<BulkCreateResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create FormData and append the CSV file
      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Make POST request to the bulk create endpoint
      const response = await axiosInstance.post(
        "/admin/bulk-create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to process CSV file");
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while uploading the CSV file";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bulkCreate,
    isLoading,
    error,
  };
};
