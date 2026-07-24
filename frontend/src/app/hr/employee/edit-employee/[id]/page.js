"use client";

import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { useForm, FormProvider } from "react-hook-form";

import { toast } from "react-hot-toast";

import API from "../../../../../utils/axiosInstance";

import { useMasterData } from "../../../../components/hooks/useMasterData";

import { updateEmployeeDetailSchema } from "../../../../components/validations/employeeValidation";

import { employeeNewDTO } from "../../../../components/validations/normalize";

import EmployeeForm from "../../../../components/section/EmployeeBasicAndQualifications";

import { fetchParOfficers } from "../../../../../redux/slices/officerSlice";

import {
  fetchRoles,
  fetchDesignations,
  fetchCategories,
      fetchDepartments,

} from "../../../../../redux/slices/masterSlice";

const EditEmployee = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { id } = useParams();

  /* =========================
     STATES
  ========================= */

  const [employee, setEmployee] = useState(null);

  const [pageLoading, setPageLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     REACT HOOK FORM
  ========================= */

  const methods = useForm({
    mode: "onBlur",
  });

  /* =========================
     REDUX
  ========================= */

  const {
    reportingOfficers,
    reviewingOfficers,
    acceptingOfficers,
    loading: officersLoading,
  } = useSelector((state) => state.officers);

  /* =========================
     MASTER DATA
  ========================= */

  const master = useMasterData();

  /* =========================
     FETCH MASTER DATA
  ========================= */

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDesignations());
    dispatch(fetchCategories());
    dispatch(fetchDepartments());
    dispatch(fetchParOfficers());
  }, [dispatch]);

  /* =========================
     FETCH EMPLOYEE
  ========================= */

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setPageLoading(true);

        const res = await API.get(`/employees/employee-new/${id}`);

        setEmployee(res.data.data);
      } catch (err) {
        console.error("FETCH ERROR:", err);

        toast.error(
          err?.response?.data?.message || "Failed to fetch employee data",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  /* =========================
     RESET FORM
  ========================= */

  useEffect(() => {
    if (!employee) return;

    methods.reset(employeeNewDTO(employee));
  }, [employee]);

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const payload = employeeNewDTO(data);

      const validated = await updateEmployeeDetailSchema.validate(payload, {
        abortEarly: false,
      });

      await API.put(`/employees/${id}`, validated);

      toast.success("Employee updated successfully");

      router.push("/hr/employee");
    } catch (err) {
      console.error("UPDATE ERROR:", err);

      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      if (err?.inner && Array.isArray(err.inner)) {
        message = err.inner.map((e) => e.message).join(", ");
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING UI
  ========================= */

  if (pageLoading && !employee) {
    return <div className="p-6 text-gray-600">Loading employee data...</div>;
  }

  /* =========================
     UI
  ========================= */

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
          loading={submitting || pageLoading}
          buttonText="Update Employee"
          isEdit={true}
        />
      </form>
    </FormProvider>
  );
};

export default EditEmployee;
