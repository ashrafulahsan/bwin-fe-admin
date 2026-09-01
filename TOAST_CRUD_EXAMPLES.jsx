/**
 * Example CRUD Form Implementations
 * Real-world examples showing toast integration with forms and API calls
 * 
 * These are template examples - adapt to your actual use cases
 */

// ============================================
// EXAMPLE 1: CREATE COURSE FORM
// ============================================

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/services/apiClient";

// Validation schema
const createCourseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  instructor: z.string().min(1, "Instructor is required"),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

export default function CreateCourseForm() {
  const { showSuccess, showError, showInfo } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<CreateCourseFormData>({
      resolver: zodResolver(createCourseSchema),
    });

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      showInfo("Creating course...");

      const response = await apiClient.post("/courses", data);

      if (response.status === 201) {
        showSuccess(`Course "${data.name}" created successfully!`, {
          title: "Course Created",
        });
        reset(); // Reset form
        // Redirect or refresh list as needed
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create course";
      showError(message, {
        title: "Creation Failed",
        duration: 7000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Course Name</label>
        <input
          {...register("name")}
          placeholder="Enter course name"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register("description")}
          placeholder="Enter course description"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label>Category</label>
        <select
          {...register("category")}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select category</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label>Price</label>
        <input
          {...register("price")}
          type="number"
          placeholder="Enter price"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label>Instructor</label>
        <input
          {...register("instructor")}
          placeholder="Enter instructor name"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.instructor && (
          <p className="text-red-500">{errors.instructor.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}

// ============================================
// EXAMPLE 2: UPDATE COURSE FORM
// ============================================

export default function UpdateCourseForm({ courseId, initialData }) {
  const { showSuccess, showFailed, showWarning } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async (data) => {
    try {
      // Validate no changes
      if (JSON.stringify(data) === JSON.stringify(initialData)) {
        showWarning("No changes made", {
          duration: 3000,
        });
        return;
      }

      const response = await apiClient.put(`/courses/${courseId}`, data);

      showSuccess("Course updated successfully!", {
        title: "Update Successful",
      });
    } catch (error: any) {
      showFailed(error.response?.data?.message || "Failed to update course", {
        title: "Update Failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Course name" />
      <textarea {...register("description")} placeholder="Description" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Course"}
      </button>
    </form>
  );
}

// ============================================
// EXAMPLE 3: DELETE CONFIRMATION MODAL
// ============================================

export default function DeleteConfirmationModal({ itemName, onConfirm, isLoading }) {
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    try {
      await onConfirm();
      showSuccess(`${itemName} deleted successfully!`, {
        title: "Deleted",
      });
    } catch (error: any) {
      showError(error.message || `Failed to delete ${itemName}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-bold mb-4">Delete {itemName}?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => {}}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: BULK OPERATIONS
// ============================================

export default function BulkActionToolbar({ selectedIds }) {
  const { showSuccess, showError, showInfo } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showWarning("No items selected");
      return;
    }

    try {
      setIsProcessing(true);
      showInfo(`Deleting ${selectedIds.length} items...`);

      await apiClient.post("/bulk-delete", { ids: selectedIds });

      showSuccess(`Successfully deleted ${selectedIds.length} items!`, {
        title: "Bulk Delete Complete",
      });
    } catch (error: any) {
      showError(error.message || "Bulk delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkPublish = async () => {
    try {
      setIsProcessing(true);
      showInfo(`Publishing ${selectedIds.length} items...`);

      await apiClient.post("/bulk-publish", { ids: selectedIds });

      showSuccess(`Successfully published ${selectedIds.length} items!`);
    } catch (error: any) {
      showError(error.message || "Bulk publish failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleBulkPublish}
        disabled={isProcessing || selectedIds.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Publish ({selectedIds.length})
      </button>
      <button
        onClick={handleBulkDelete}
        disabled={isProcessing || selectedIds.length === 0}
        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
      >
        Delete ({selectedIds.length})
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 5: ASYNC FILE UPLOAD
// ============================================

export default function FileUploadForm() {
  const { showSuccess, showError, showWarning } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = async (file: File) => {
    // Validate file
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      showWarning("Invalid file type. Supported: JPEG, PNG, PDF");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showWarning("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(`File "${file.name}" uploaded successfully!`);
      return response.data;
    } catch (error: any) {
      showError(error.message || "Upload failed", {
        duration: 7000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}

// ============================================
// EXAMPLE 6: MULTI-STEP FORM WITH VALIDATIONS
// ============================================

export default function MultiStepForm() {
  const { showInfo, showWarning, showSuccess } = useToast();
  const [step, setStep] = React.useState(1);

  const handleNext = async (data) => {
    if (!data.email) {
      showWarning("Email is required");
      return;
    }

    showInfo("Moving to next step...");
    setStep(2);
  };

  const handleSubmit = async (allData) => {
    try {
      showInfo("Submitting form...");
      // Submit logic
      showSuccess("Form submitted successfully!");
    } catch (error) {
      showWarning("Please complete all required fields");
    }
  };

  return (
    <div>
      {step === 1 && <Step1Form onNext={handleNext} />}
      {step === 2 && <Step2Form onSubmit={handleSubmit} />}
    </div>
  );
}

// ============================================
// EXAMPLE 7: PASSWORD RESET
// ============================================

export default function PasswordResetForm({ email }) {
  const { showSuccess, showError } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.passwordConfirm) {
      showWarning("Passwords do not match");
      return;
    }

    try {
      await apiClient.post("/reset-password", {
        email,
        newPassword: data.password,
      });

      showSuccess("Password reset successfully! Redirecting to login...", {
        duration: 3000,
      });
      // Redirect to login
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to reset password", {
        duration: 7000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("password")}
        type="password"
        placeholder="New password"
      />
      <input
        {...register("passwordConfirm")}
        type="password"
        placeholder="Confirm password"
      />
      <button type="submit" disabled={isSubmitting}>
        Reset Password
      </button>
    </form>
  );
}

// ============================================
// EXAMPLE 8: IMPORT/EXPORT DATA
// ============================================

export default function ImportExportPanel() {
  const { showSuccess, showError, showInfo } = useToast();

  const handleExport = async () => {
    try {
      showInfo("Generating export...");
      const response = await apiClient.get("/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();

      showSuccess("Data exported successfully!");
    } catch (error: any) {
      showError("Export failed");
    }
  };

  const handleImport = async (file: File) => {
    try {
      showInfo("Importing data...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/import", formData);

      showSuccess(
        `Successfully imported ${response.data.count} records!`,
        {
          title: "Import Complete",
        }
      );
    } catch (error: any) {
      showError(error.response?.data?.message || "Import failed", {
        duration: 7000,
      });
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Export Data
      </button>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
        accept=".csv,.xlsx"
      />
    </div>
  );
}

// ============================================
// EXAMPLE 9: REAL-TIME VALIDATION
// ============================================

export default function EmailValidationInput() {
  const { showSuccess, showError, showWarning } = useToast();
  const [email, setEmail] = React.useState("");
  const [isChecking, setIsChecking] = React.useState(false);

  const checkEmailAvailability = React.useCallback(
    async (value) => {
      if (!value.includes("@")) {
        showWarning("Enter a valid email format");
        return;
      }

      try {
        setIsChecking(true);
        const response = await apiClient.get(`/check-email?email=${value}`);

        if (response.data.available) {
          showSuccess("Email is available!");
        } else {
          showWarning("Email already registered");
        }
      } catch (error) {
        showError("Could not verify email");
      } finally {
        setIsChecking(false);
      }
    },
    [showSuccess, showWarning, showError]
  );

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => checkEmailAvailability(email)}
        placeholder="Enter email"
        className="w-full px-4 py-2 border rounded"
      />
      {isChecking && <p className="text-sm text-blue-600">Checking...</p>}
    </div>
  );
}

export const EXAMPLES_SUMMARY = `
These examples demonstrate common patterns for integrating the toast notification system:

1. ✅ CREATE: Adding with success/error handling
2. ✅ UPDATE: Modifying with change detection
3. ✅ DELETE: Confirmation with feedback
4. ✅ BULK: Multiple operations with progress
5. ✅ UPLOAD: File uploads with validation
6. ✅ MULTI-STEP: Progress through forms
7. ✅ PASSWORD: Sensitive operations
8. ✅ IMPORT/EXPORT: Data operations
9. ✅ VALIDATION: Real-time feedback

All examples follow these best practices:
- Clear, user-friendly messages
- Appropriate toast types for each scenario
- Error handling with user feedback
- Loading states
- Proper timing and durations
`;
