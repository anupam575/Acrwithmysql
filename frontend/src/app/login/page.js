"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import API from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../redux/slices/authslice";

import { useForm, FormProvider } from "react-hook-form";
import LoginUI from "../components/section/LoginUI";

export default function LoginContainer() {
  const router = useRouter();
  const dispatch = useDispatch();

  // =========================
  // FORM
  // =========================
  const methods = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, getValues } = methods;

  const [loading, setLoading] = useState(false);

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
      const res = await API.post("employees/login", {
        identifier: data.identifier.trim(),
        password: data.password,
      });

      const response = res?.data;

      console.log("LOGIN RESPONSE =>", response);

      // =========================
      // FAILED LOGIN
      // =========================
      if (!response?.success) {
        const msg = response?.message;

        if (msg === "Email is incorrect") {
          toast.error("Email not found");
        } else if (msg === "Phone number is incorrect") {
          toast.error("Phone number not found");
        } else if (msg === "Password is incorrect") {
          toast.error("Password is incorrect");
        } else if (msg === "Account inactive") {
          toast.error("Account is inactive");
        } else {
          toast.error(msg || "Login failed");
        }

        return;
      }

      // =========================
      // SUCCESS LOGIN
      // =========================
      toast.success(response?.message || "Login successful");

      dispatch(fetchUser());

      const role = response?.emp?.role?.role_key;

      const roleRoutes = {
        emp: "/employee",
      };

      const route = roleRoutes[role];

      if (route) {
        router.replace(route);
      } else {
        toast.error("Unauthorized role");
      }

    } catch (err) {
      console.error("LOGIN ERROR =>", err);

      const msg = err?.response?.data?.message || err?.message;

      if (msg === "Email is incorrect") {
        toast.error("Email not found");
      } else if (msg === "Phone number is incorrect") {
        toast.error("Phone number not found");
      } else if (msg === "Password is incorrect") {
        toast.error("Password is incorrect");
      } else if (msg === "Account inactive") {
        toast.error("Account is inactive");
      } else {
        toast.error(msg || "Login failed");
      }

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