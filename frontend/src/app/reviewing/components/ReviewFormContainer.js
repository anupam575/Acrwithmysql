"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import SectionIV from "./Section";
import API from "../../../utils/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ReviewFormContainer({ employeeId }) {
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      financialYear: "",
      assessmentAgree1: "",
      assessmentAgree2: "",
      differenceReason: "",
      penPictureComments: "",
      overallGrade: "",
      officerSignature: null,
      nameDesignation: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("========== FORM SUBMIT START ==========");
      console.log("EMPLOYEE ID:", employeeId);
      console.log("RAW FORM DATA:", data);

      if (!employeeId) {
        throw new Error("Employee ID missing");
      }

      const financialYear =
        data.financialYear ||
        (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        })();

      const formData = new FormData();

      formData.append("employeeId", String(employeeId));
      formData.append("currentFinancialYear", financialYear);

      formData.append("assessmentAgree1", data.assessmentAgree1 || "");

      formData.append("assessmentAgree2", data.assessmentAgree2 || "");

      formData.append("differenceReason", data.differenceReason || "");

      formData.append("penPictureComments", data.penPictureComments || "");

      formData.append("overallGrade", String(Number(data.overallGrade || 0)));

      formData.append("nameDesignation", data.nameDesignation || "");

      // Upload signature image
      if (data.officerSignature instanceof File) {
        formData.append("officerSignature", data.officerSignature);
      } else if (data.officerSignature?.[0] instanceof File) {
        formData.append("officerSignature", data.officerSignature[0]);
      }

      console.log("========== FORM DATA ==========");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await API.post("/review/create", formData);

      console.log("========== SUCCESS RESPONSE ==========");
      console.log(res.data);

      toast.success(res?.data?.message || "Form submitted successfully!");

      router.push("/reviewing/allemp");
    } catch (error) {
      console.log("========== ERROR ==========");
      console.error(error?.response?.data || error);

      toast.error(
        error?.response?.data?.message || error?.message || "Submission failed",
      );
    } finally {
      console.log("========== SUBMIT END ==========");
    }
  };

  return (
    <FormProvider {...methods}>
      {" "}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {" "}
        <SectionIV />{" "}
      </form>{" "}
    </FormProvider>
  );
}
