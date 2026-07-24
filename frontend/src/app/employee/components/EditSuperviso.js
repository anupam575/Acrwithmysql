"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import API from "../../../utils/axiosInstance";
import Supervisor from "./supervisor";

export default function EditSupervisor() {
  const router = useRouter();
  const params = useParams();

  const supervisorId = params?.id;

  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      tasks: "",
      achievements: "",
      shortfalls: "",
      higherAchievements: "",
      place: "",
      date: "",
      signature: "",
      financialYear: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!supervisorId) return;

    fetchSupervisor();
  }, [supervisorId]);

  const fetchSupervisor = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/supervisors/${supervisorId}`
      );

      if (res?.data?.success) {
        const supervisorData =
          res.data.data;

        reset({
          tasks:
            supervisorData?.tasks || "",
          achievements:
            supervisorData?.achievements ||
            "",
          shortfalls:
            supervisorData?.shortfalls ||
            "",
            name: supervisorData?.name || "",
  designation: supervisorData?.designation || "",

          higherAchievements:
            supervisorData?.higherAchievements ||
            "",
          place:
            supervisorData?.place || "",
          date:
            supervisorData?.date
              ?.split("T")[0] || "",
          signature:
            supervisorData?.signature ||
            "",
          financialYear:
            supervisorData?.financialYear ||
            "",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch supervisor appraisal"
      );

      router.push(
        "/employee/allapprisal"
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (
    formData
  ) => {
    try {
      const payload = {
        tasks: formData.tasks,
        name: formData.name,
        designation: formData.designation,
        achievements:
          formData.achievements,
        shortfalls:
          formData.shortfalls,
        higherAchievements:
          formData.higherAchievements,
        place: formData.place,
        date: formData.date,
        signature:
          formData.signature,
        financialYear:
          formData.financialYear,
      };

      const res = await API.put(
        `/supervisors/${supervisorId}`,
        payload
      );

      if (res?.data?.success) {
        toast.success(
          "Supervisor Appraisal Updated Successfully"
        );

        reset(payload);

        setTimeout(() => {
          router.push(
            "/employee/allapprisal"
          );
        }, 1000);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update supervisor appraisal"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-medium">
        Loading Supervisor Appraisal...
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="p-6 space-y-4"
      >
        <Supervisor
          isEdit={true}
          isSubmitting={
            isSubmitting
          }
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting
            }
          >
           
          </button>
        </div>
      </form>
    </FormProvider>
  );
}