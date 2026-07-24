"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import PartVIAcceptingAuthority from "../components/PartVIAcceptingAuthority";
import API from "../../../utils/axiosInstance";

const PerformanceReviewContainer = ({ employeeId }) => {

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      acceptingAssessment: "",
      acceptingRemarks: "",
      acceptingTotalScore: "",
      acceptingPlace: "",
      acceptingDate: "",
      acceptingName: "",
      acceptingDesignation: "",
      officerSignature: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("employeeId", employeeId);

      formData.append("acceptingAssessment", data.acceptingAssessment || "");
      formData.append("acceptingRemarks", data.acceptingRemarks || "");
      formData.append("acceptingTotalScore", data.acceptingTotalScore ?? "");
      formData.append("acceptingPlace", data.acceptingPlace || "");
      formData.append("acceptingDate", data.acceptingDate || "");
      formData.append("acceptingName", data.acceptingName || "");
      formData.append("acceptingDesignation", data.acceptingDesignation || "");

      if (data.officerSignature instanceof File) {
        formData.append("officerSignature", data.officerSignature);
      }

      const { data: response } = await API.post(
        "/accept/acceptancer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.message);
      methods.reset();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit form."
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <PartVIAcceptingAuthority
        onSubmit={methods.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default PerformanceReviewContainer;