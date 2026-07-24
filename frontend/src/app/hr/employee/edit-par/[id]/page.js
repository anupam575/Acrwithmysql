"use client";

import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { useForm, FormProvider } from "react-hook-form";

import { toast } from "react-hot-toast";

import API from "../../../../../utils/axiosInstance";

import { useMasterData } from "../../../../components/hooks/useMasterData";

import { updateEmployeeDetailSchema } from "../../../../components/validations/employeeDetailValidation";

import { employeeDTO } from "../../../../components/validations/normalize";

import PARFormFields from "../../../../components/section/parfield";

import { fetchParOfficers } from "../../../../../redux/slices/officerSlice";

import {
  fetchRoles,
  fetchDesignations,
  fetchCategories,
        fetchDepartments,

  
} from "../../../../../redux/slices/masterSlice";

import { buildUpdateEmployeeFormData } from "../../../../components/validations/buildEmployeeFormData";

const EditEmployee = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { id } = useParams();

  const methods = useForm({
    mode: "onBlur",
  });

  const {
    reportingOfficers,
    reviewingOfficers,
    acceptingOfficers,
    loading: officersLoading,
  } = useSelector((state) => state.officers);

  const master = useMasterData();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDesignations());
    dispatch(fetchCategories());
          dispatch(fetchDepartments());
    
    dispatch(fetchParOfficers());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/employees/employee-detail/${id}`);

        setEmployee(res?.data?.data);
      } catch (err) {
        console.error("FETCH ERROR:", err);

        toast.error(
          err?.response?.data?.message || "Failed to fetch employee data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (!employee) return;

    methods.reset(employeeDTO(employee));
  }, [employee]);

 const onSubmit = async (data) => {
  try {
    console.log(
      "RAW FORM DATA =>",
      JSON.stringify(data.authorities, null, 2)
    );

    const validated = await updateEmployeeDetailSchema.validate(data, {
      abortEarly: false,
    });

    console.log(
      "VALIDATED DATA =>",
      JSON.stringify(validated.authorities, null, 2)
    );

    const formData = buildUpdateEmployeeFormData(validated);

    console.log("FORM DATA ENTRIES =>");

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await API.put(
      `employees/details/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(
      "UPDATE RESPONSE =>",
      response?.data
    );

    toast.success(
      response?.data?.message || "Employee updated successfully"
    );

    router.push("/hr/employee");
  } catch (err) {
    console.error("UPDATE ERROR =>", err);

    console.log("ERROR RESPONSE =>", err?.response);
    console.log("ERROR DATA =>", err?.response?.data);
    console.log("DIRECT ERROR =>", err);

    let message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.data?.message ||
      err?.message ||
      "Something went wrong";

    if (err?.inner && Array.isArray(err.inner)) {
      message = err.inner.map((e) => e.message).join(", ");
    }

    toast.error(String(message));
  }
};

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading employee data...
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
          buttonText="Update Employee"
          isEdit={true}
        />
      </form>
    </FormProvider>
  );
};

export default EditEmployee;