"use client";

import { FormProvider, useForm } from "react-hook-form";
import PerformanceReviewForm from "../components/PerformanceReviewForm";

export default function PerformanceReviewPage() {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <PerformanceReviewForm onSubmit={onSubmit} />
    </FormProvider>
  );
}