"use client";

import {
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import SelfAppraisalFields from "./SelfAppraisalFields";
import API from "../../../utils/axiosInstance";

import {
  selfAppraisalDefaultValues,
} from "../../../constants/selfAppraisalDefaults";

import {
  createSelfAppraisalPayload,
} from "../../components/validations/selfAppraisalPayload";

export default function SelfAppraisalForm({
  officerId,
  departmentId,
}) {
  const router = useRouter();

  /* ================= FORM ================= */
  const methods = useForm({
    defaultValues: selfAppraisalDefaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  /* ================= FIELD ARRAY ================= */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...createSelfAppraisalPayload(formData),

        // 🔥 IMPORTANT FIELDS
        reportingOfficerId: officerId,
        department: departmentId,
      };

      // ================= FORM DATA =================
      const submitData = new FormData();

      // Existing payload ko FormData me convert karo
      Object.entries(payload).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null
        ) {
          if (
            typeof value === "object" &&
            !(value instanceof File)
          ) {
            submitData.append(
              key,
              JSON.stringify(value)
            );
          } else {
            submitData.append(key, value);
          }
        }
      });

      // ================= OFFICER SIGNATURE =================
      if (formData.officerSignature instanceof File) {
        submitData.append(
          "officerSignature",
          formData.officerSignature
        );
      } else if (
        formData.officerSignature?.[0] instanceof File
      ) {
        submitData.append(
          "officerSignature",
          formData.officerSignature[0]
        );
      }

      console.log("FINAL PAYLOAD", payload);

      const res = await API.post(
        "/self-appraisal/create",
        submitData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(
          "Self Appraisal Submitted Successfully"
        );

        reset(selfAppraisalDefaultValues);

        router.push("/employee/allapprisal");
      }
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Server Error"
      );
    }
  };

  /* ================= UI ================= */
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
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
  );
}