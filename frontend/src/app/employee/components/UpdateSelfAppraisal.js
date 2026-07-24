"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { toast } from "react-hot-toast";

import SelfAppraisalFields from "./SelfAppraisalFields";

import { createSelfAppraisalPayload } from "../../components/validations/selfAppraisalPayload";

import { selfAppraisalDTO } from "../../components/validations/selfAppraisalDTO";

import API from "../../../utils/axiosInstance";

export default function UpdateSelfAppraisal() {

  /* ================= ROUTER ================= */

  const router = useRouter();

  /* ================= PARAMS ================= */

  const params = useParams();

  const appraisalId = params?.id;

  /* ================= STATES ================= */

  const [loading, setLoading] =
    useState(false);

  /* ================= FORM ================= */

  const methods = useForm({
    defaultValues:
      selfAppraisalDTO(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      isSubmitting,
    },
  } = methods;

  /* ================= FIELD ARRAY ================= */

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "tasks",
  });

  /* ================= FETCH SINGLE APPRAISAL ================= */

  useEffect(() => {

    if (!appraisalId) return;

    const fetchSelfAppraisal =
      async () => {

        try {

          setLoading(true);

          const res =
            await API.get(
              `/self-appraisal/${appraisalId}`
            );

          if (
            res?.data?.success
          ) {

            const normalizedData =
              selfAppraisalDTO(
                res.data.data
              );

            reset(
              normalizedData
            );
          }

        } catch (error) {

          console.log(error);

          toast.error(
            error?.response
              ?.data?.message ||
              "Failed To Fetch Self Appraisal"
          );

          router.push(
            "/employee/allapprisal"
          );

        } finally {

          setLoading(false);

        }
      };

    fetchSelfAppraisal();

  }, [
    appraisalId,
    reset,
    router,
  ]);

  /* ================= UPDATE SUBMIT ================= */

  const onSubmit =
    async (formData) => {

      try {

        const payload =
          createSelfAppraisalPayload(
            formData
          );

        const res =
          await API.put(
            `/self-appraisal/update/${appraisalId}`,
            payload
          );

        if (
          res?.data?.success
        ) {

          toast.success(
            "Self Appraisal Updated Successfully"
          );

          const normalizedData =
            selfAppraisalDTO(
              res.data.data
            );

          reset(
            normalizedData
          );

          /* ================= REDIRECT ================= */

          setTimeout(() => {

            router.push(
              "/employee/allapprisal"
            );

          }, 1000);
        }

      } catch (error) {

        console.log(error);

        toast.error(
          error?.response
            ?.data?.message ||
            "Server Error"
        );
      }
    };

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="p-10 text-center text-lg font-medium text-gray-600">
        Loading Self Appraisal...
      </div>
    );
  }

  /* ================= JSX ================= */

  return (
    <FormProvider {...methods}>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-4"
      >

        <SelfAppraisalFields
          fields={fields}
          append={append}
          remove={remove}
          isSubmitting={
            isSubmitting
          }
          isEdit={true}
        />

      </form>

    </FormProvider>
  );
}