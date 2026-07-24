"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import PartVReviewingOfficer from "../components/PartVReviewingOfficer";

const ReviewingOfficerFormContainer = () => {
  const methods = useForm({
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Submitted Data:", data);

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
        <PartVReviewingOfficer />

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ReviewingOfficerFormContainer;