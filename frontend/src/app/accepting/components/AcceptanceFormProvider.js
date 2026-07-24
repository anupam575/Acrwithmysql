"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AcceptanceSectionForm from "../components/AcceptanceSection";
import API from "../../../utils/axiosInstance";

const AcceptanceFormProvider = ({ employeeId }) => {
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      financialYear: "",
      overallGradeConsistent: "",
      agreeWithRemarks: "",
      differenceOpinion: "",
      overallGrade: "",
      officerSignature: null,
      acceptingAuthorityNameDesignation: "",
    },
  });

  const submitAcceptanceSection = async (data) => {
    try {
      console.log("========== ACCEPTANCE FORM SUBMIT START ==========");
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

      formData.append(
        "overallGradeConsistent",
        data.overallGradeConsistent || "",
      );

      formData.append("agreeWithRemarks", data.agreeWithRemarks || "");

      formData.append("differenceOpinion", data.differenceOpinion || "");

      formData.append("overallGrade", String(Number(data.overallGrade || 0)));

      formData.append(
        "acceptingAuthorityNameDesignation",
        data.acceptingAuthorityNameDesignation || "",
      );

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

      const res = await API.post("/accept/acceptance-section", formData);

      console.log("========== SUCCESS RESPONSE ==========");
      console.log(res.data);

      toast.success(res?.data?.message || "Form submitted successfully!");

      methods.reset({
        financialYear: "",
        overallGradeConsistent: "",
        agreeWithRemarks: "",
        differenceOpinion: "",
        overallGrade: "",
        officerSignature: null,
        acceptingAuthorityNameDesignation: "",
      });

      router.push("/accepting/allemp");
    } catch (error) {
      console.error(
        "========== ERROR ==========",
        error?.response?.data || error,
      );

      toast.error(
        error?.response?.data?.message || error?.message || "Submission failed",
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <AcceptanceSectionForm
        onSubmit={methods.handleSubmit(submitAcceptanceSection)}
      />{" "}
    </FormProvider>
  );
};

export default AcceptanceFormProvider;
