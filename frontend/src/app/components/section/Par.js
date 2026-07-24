"use client";

import React, { useEffect, useState } from "react";

import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useDispatch, useSelector } from "react-redux";

import { useMasterData } from "../../components/hooks/useMasterData";

import PARFormFields from "../../components/section/parfield";

import API from "../../../utils/axiosInstance";

import { employeeDetailSchema } from "../../components/validations/employeeDetailValidation";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { fetchParOfficers } from "../../../redux/slices/officerSlice";

import {
  fetchRoles,
  fetchDesignations,
  fetchCategories,
    fetchDepartments,

} from "../../../redux/slices/masterSlice";

import parDefaultValues from "../../../constants/parDefaultValues";

import { buildEmployeeFormData } from "../../components/validations/buildEmployeeFormData";

const PARForm = ({ handleBack }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // =========================
  // SHOW / HIDE PASSWORD
  // =========================
  const [showPassword, setShowPassword] = useState(false);

  const master = useMasterData();

  const {
    reportingOfficers,
    reviewingOfficers,
    acceptingOfficers,
    loading: officersLoading,
  } = useSelector((state) => state.officers);

  // =========================
  // FORM METHODS
  // =========================
  const methods = useForm({
    resolver: yupResolver(employeeDetailSchema),

    mode: "onBlur",

    defaultValues: {
      ...parDefaultValues,

      // =========================
      // IMPORTANT FOR FILE PREVIEW
      // =========================
      recentPhotograph: parDefaultValues?.recentPhotograph || null,

      officerSignature: parDefaultValues?.officerSignature || null,

    },
  });

  const { handleSubmit, reset } = methods;

  
  useEffect(() => {
    dispatch(fetchRoles());

    dispatch(fetchDesignations());

    dispatch(fetchCategories());
      dispatch(fetchDepartments());


    dispatch(fetchParOfficers());
  }, [dispatch]);

  // =========================
  // SUBMIT
  // =========================
  const onSubmit = async (data) => {
    if (loading) return;

    try {
      setLoading(true);

      // =========================
      // BUILD FORM DATA
      // =========================
      const formData = buildEmployeeFormData(data);

      // =========================
      // API CALL
      // =========================
      const res = await API.post("/employees/create/detailed", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // =========================
      // SUCCESS
      // =========================
      toast.success(res?.data?.message || "PAR submitted successfully 🎉");





      router.push("/hr/employee");









      // =========================
      // RESET FORM
      // =========================
      reset({
        ...parDefaultValues,

        recentPhotograph: null,

        officerSignature: null,

        medicalExamination: {
          date: null,
          reportSummary: "",
          reportDocument: null,
        },
      });

      // =========================
      // RESET PASSWORD VISIBILITY
      // =========================
      setShowPassword(false);
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-6 bg-gray-50"
      >
        <PARFormFields
          master={master}
          officers={{
            reportingOfficers,
            reviewingOfficers,
            acceptingOfficers,
            loading: officersLoading,
          }}
          
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          
          loading={loading}
          buttonText="Create Employee"
         handleBack={handleBack}   // ✅ Pass here

          isEdit={false}
        />
      </form>
    </FormProvider>
  );
};

export default PARForm;
