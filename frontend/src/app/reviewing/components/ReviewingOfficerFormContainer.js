"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import PartVReviewingOfficer from "../components/PartVReviewingOfficer";
import API from "../../../utils/axiosInstance";

const ReviewingOfficerFormContainer = ({ employeeId }) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      reviewAssessment: "",
      reviewRemarks: "",
      reviewTotalScore: "",
      reviewPlace: "",
      reviewDate: "",
      reviewName: "",
      reviewDesignation: "",
      officerSignature: null,
    },
  });


  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("employeeId", employeeId);

      Object.entries(data).forEach(([key, value]) => {

        // File field
        if (key === "officerSignature") {
          if (value instanceof File) {
            formData.append(key, value);
          }
          return;
        }

        // Other fields
        formData.append(
          key,
          value || ""
        );
      });


      // Debug
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }


      const { data: response } = await API.post(
        "/review/creater",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      alert(
        response.message ||
        "Reviewing Officer created successfully"
      );


      methods.reset();


    } catch (error) {

      console.error(
        "Create Reviewing Officer Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to create Reviewing Officer"
      );
    }
  };


  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <PartVReviewingOfficer />
      </form>
    </FormProvider>
  );
};

export default ReviewingOfficerFormContainer;