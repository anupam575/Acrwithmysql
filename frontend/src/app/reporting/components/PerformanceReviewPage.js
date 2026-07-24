"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import PerformanceReviewForm from "../components/PerformanceReviewForm";
import API from "../../../utils/axiosInstance";

import createPerformanceReviewFormData from "../../components/validations/PerformanceReviewFormData";
import { reportingOfficerDefaultValues } from "../../../constants/formDefaultValues";

export default function PerformanceReviewPage({ employeeId }) {
  const router = useRouter();

  const methods = useForm({
    defaultValues: reportingOfficerDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const formData = createPerformanceReviewFormData(data);

      // Employee Id
      formData.append("employeeId", employeeId);

      // Officer Signature
      if (data.officerSignature) {
        formData.append(
          "officerSignature",
          data.officerSignature
        );
      }

      const response = await API.post(
        "/reporter/creater",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Performance Review submitted successfully."
      );

      methods.reset(reportingOfficerDefaultValues);

      // Redirect after success
      setTimeout(() => {
        router.push("/reporting");
      }, 1200);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <PerformanceReviewForm onSubmit={onSubmit} />
    </FormProvider>
  );
}