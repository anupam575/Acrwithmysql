"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { useMasterData } from "../../components/hooks/useMasterData";

import EmployeeForm from "../../components/section/EmployeeBasicAndQualifications";
import { useRouter } from "next/navigation";

import API from "../../../utils/axiosInstance";

import { employeeSchema } from "../../components/validations/employeeValidation";

import { fetchParOfficers } from "../../../redux/slices/officerSlice";

import {
  fetchRoles,
  fetchDesignations,
  fetchCategories,
      fetchDepartments,

} from "../../../redux/slices/masterSlice";

const EmployeePage = ({ handleBack }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  /* =========================
     STATES
  ========================= */
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================
     MASTER DATA
  ========================= */
  const master = useMasterData();

  /* =========================
     OFFICERS
  ========================= */
  const {
    reportingOfficers,
    reviewingOfficers,
    acceptingOfficers,
    loading: officersLoading,
  } = useSelector((state) => state.officers);

  /* =========================
     FORM
  ========================= */
  const methods = useForm({
    resolver: yupResolver(employeeSchema),

    mode: "onBlur",

    defaultValues: {
  employeeCode: "",

      employee_name: "",

      role: "",

designations: [],
      category: "",
authorities: {
    reporting: [],

    reviewing: [],

    accepting: [],
  },
    phoneNumber: "",    // ✅ Add this

  educationalProfessionalQualifications: {
    education: [],

    professional: [],

    otherDetails: "",
  },

  basicTrainings: [],

  basicLeaves: [],
    },
  });

  const { handleSubmit, reset } = methods;

  /* =========================
     LOAD MASTER DATA
  ========================= */
  useEffect(() => {
    dispatch(fetchRoles());

    dispatch(fetchDesignations());

    dispatch(fetchCategories());
          dispatch(fetchDepartments());
    

    dispatch(fetchParOfficers());
  }, [dispatch]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,

        role: data.role || null,

  designations: data.designations || [],

        category: data.category || null,
      };

      const res = await API.post("/employees/create/basic", payload);

      toast.success(res?.data?.message || "Employee created successfully!");

      console.log(res.data);
      router.push("/hr/employee");

      reset();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          max-w-7xl
          mx-auto
          p-6
          space-y-6
        "
      >
        {/* =========================
            EMPLOYEE FORM
        ========================= */}
        <EmployeeForm
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
          buttonText="Create employee"
          isEdit={false}
            handleBack={handleBack}   // ✅ Pass here

        />
      </form>
    </FormProvider>
  );
};

export default EmployeePage;
