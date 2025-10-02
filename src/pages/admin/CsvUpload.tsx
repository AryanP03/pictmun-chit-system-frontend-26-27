import React, { useState } from "react";
import { useBulkCreate } from "../../hooks/useBulkCreate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const CsvUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { bulkCreate, isLoading } = useBulkCreate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".csv")) {
        setErrorMessage("Please select a valid CSV file");
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select a CSV file to upload");
      setUploadStatus("error");
      return;
    }

    try {
      await bulkCreate(selectedFile);
      setUploadStatus("success");
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("csv-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message || "Failed to upload CSV file");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    const fileInput = document.getElementById("csv-file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="flex justify-start px-6 md:px-12 lg:px-16 mt-8 md:mt-12 lg:mt-16">
      <Card className="max-w-2xl w-full bg-transparent border-0 shadow-none p-0">
        <CardHeader className="px-0 pb-6">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Upload className="h-8 w-8 text-primary" />
            CSV Upload
          </CardTitle>
          <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
          <p className="text-muted-foreground mt-4">
            Upload a CSV file to bulk create entries in the system
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="px-0 space-y-6">
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label
                htmlFor="csv-file"
                className="text-base font-semibold text-foreground"
              >
                Select CSV File
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="flex-1 h-12 text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <FileText className="h-4 w-4" />
                  <span>Selected: {selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {uploadStatus === "success" && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  CSV file uploaded successfully! The data has been processed
                  and added to the system.
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && errorMessage && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Upload Instructions */}
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
              <h4 className="font-medium mb-2">CSV Format Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure your CSV file has the correct headers</li>
                <li>• File size should not exceed 10MB</li>
                <li>• Use UTF-8 encoding for special characters</li>
                <li>• Remove any empty rows before uploading</li>
              </ul>
            </div>
          </CardContent>

          {/* Submit Button */}
          <div className="px-0 pt-6">
            <Button
              type="submit"
              disabled={isLoading || !selectedFile}
              size="lg"
              className="text-base px-8 py-3 font-semibold min-w-40"
            >
              {isLoading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CsvUpload;
