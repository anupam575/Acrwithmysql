"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import PartVIAcceptingAuthority from "../components/PartVIAcceptingAuthority";

const PerformanceReviewContainer = () => {
  const methods = useForm({
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      // Example API Call
      // await axios.post("/api/appraisal", data);

      alert("Form Submitted Successfully");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PartVIAcceptingAuthority />

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-purple-700 px-8 py-3 font-medium text-white transition hover:bg-purple-800"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PerformanceReviewContainer;