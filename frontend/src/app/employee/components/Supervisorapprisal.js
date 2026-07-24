"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import API from "../../../utils/axiosInstance";
import Supervisor from "../components/supervisor";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function SupervisorApprisal({ reportingOfficerId, departmentId }) {
  const methods = useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        reportingOfficerId,
        department: departmentId,
      };

      const submitData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        // ✅ skip officerSignature here completely
        if (key === "officerSignature") return;

        if (value !== undefined && value !== null) {
          if (
            typeof value === "object" &&
            !(value instanceof File) &&
            !(value instanceof Blob)
          ) {
            submitData.append(key, JSON.stringify(value));
          } else {
            submitData.append(key, value);
          }
        }
      });

      // ================= OFFICER SIGNATURE =================
      const signature = formData.officerSignature;

      if (signature instanceof File) {
        submitData.append("officerSignature", signature);
      } else if (signature?.[0] instanceof File) {
        submitData.append("officerSignature", signature[0]);
      }

      console.log("Payload:", payload);

      const response = await API.post("/supervisors/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data?.message || "Submitted Successfully");

      methods.reset();
      router.push("/employee/allapprisal");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Supervisor />

          <div className="mt-4">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : ""}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SupervisorApprisal;