"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/slices/authslice";

import { useForm, FormProvider } from "react-hook-form";
import LoginUI from "./components/section/LoginUI";

export default function LoginContainer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, getValues } = methods;

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    const values = getValues();

    if (!values.identifier || !values.password) {
      toast.error("All fields are required!");
      return false;
    }

    return true;
  };

  // =========================
  // LOGIN HANDLER
  // =========================
  const loginHandler = async (data) => {
    if (loading) return;

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await API.post("/login", {
        identifier: data.identifier.trim(),
        password: data.password,
      });

      const response = res?.data;

      console.log("LOGIN RESPONSE =>", response);

      // =========================
      // FAILED
      // =========================
      if (!response?.success) {
        toast.error(response?.message || "Login failed");
        return;
      }

      // =========================
      // SUCCESS
      // =========================
      toast.success(response?.message || "Login successful");

      dispatch(fetchUser());

      const role = response?.user?.role?.role_key;

      const roleRoutes = {
        admin: "/admin",
        hr: "/hr",
        accepting: "/accepting",
        reporting: "/reporting",
        reviewing: "/reviewing",
        emp: "/employee",
          hod: "/hod",

      };

      if (roleRoutes[role]) {
        router.replace(roleRoutes[role]);
      } else {
        toast.error("Unauthorized role");
      }

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <LoginUI
        onSubmit={handleSubmit(loginHandler)}
        loading={loading}
      />
    </FormProvider>
  );
}