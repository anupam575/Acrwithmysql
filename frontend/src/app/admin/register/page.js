"use client";

import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import * as yup from "yup";

import RegisterFields from "../../components/section/RegisterFields";

import {
  fetchRoles,
  fetchDepartments,
} from "../../../redux/slices/masterSlice";
import API from "../../../utils/axiosInstance";

/* =========================
   VALIDATION SCHEMA
========================= */
const schema = yup.object().shape({
  empCode: yup.string().required("Employee Code required"),

  username: yup.string().required("Username required"),

  firstName: yup.string().required("First name required"),

  lastName: yup.string().required("Last name required"),

  email: yup.string().email("Invalid email").required("Email required"),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password required"),

phoneNumber: yup
  .string()
  .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
  .required("Phone number required"),
  role: yup.string().required("Role required"),

  profileImage: yup.mixed().nullable(),
});

export default function Register() {
  const dispatch = useDispatch();

  const router = useRouter();
const {
  roles,
  departments,
} = useSelector((state) => state.master);

const master = {
  roles: roles || [],
  departments: departments || [],
};
  const [preview, setPreview] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================
     REACT HOOK FORM
  ========================= */
  const methods = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      empCode: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: "",
      profileImage: null,
    },
  });

  const { setValue, handleSubmit, reset } = methods;

  /* =========================
     IMAGE CHANGE
  ========================= */
  const handleFileChange = (file) => {
    if (!file) return;

    setValue("profileImage", file, {
      shouldValidate: true,
    });

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  /* =========================
     CLEANUP IMAGE URL
  ========================= */
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
  dispatch(fetchRoles());

  dispatch(fetchDepartments());

}, [dispatch]);

  const onSubmit = async (data) => {
  try {
    setLoading(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    const res = await API.post("/registers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(res?.data?.message || "User created successfully");

    reset();
    setPreview(null);

    setTimeout(() => {
      router.push("/admin/allusers");
    }, 800);

  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("ERROR RESPONSE:", err?.response?.data);

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* =========================
            REGISTER FIELDS
        ========================= */}
        <RegisterFields
          master={master}
          preview={preview}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleFileChange={handleFileChange}
          loading={loading}
          buttonText="Create Account"
          isEdit={false}
        />
      </form>
    </FormProvider>
  );
}
