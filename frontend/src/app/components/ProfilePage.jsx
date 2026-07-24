"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import API from "../../utils/axiosInstance";
import { fetchUser } from "../../redux/slices/authslice";
import RegisterFields from "../components/section/RegisterFields";

const UpdateProfileForm = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] =
    useState(false);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     FORM
  ========================= */
  const methods = useForm({
    defaultValues: {
      empCode: "",
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      profileImage: null,
    },
  });

  const {
    setValue,
    handleSubmit,
    reset,
  } = methods;

  /* =========================
     USER DATA SYNC
  ========================= */
  useEffect(() => {
    if (!user) return;

    reset({
      empCode: user.empCode || "",
      username: user.username || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      profileImage: null,
    });

    setPreview(user.profilePic || "");
  }, [user, reset]);

  /* =========================
     IMAGE CHANGE
  ========================= */
  const handleImageChange = useCallback(
    (file) => {
      if (!file) return;

      setValue("profileImage", file, {
        shouldValidate: true,
      });

      const imageUrl =
        URL.createObjectURL(file);

      setPreview(imageUrl);
    },
    [setValue]
  );

  /* =========================
     CLEANUP
  ========================= */
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  

     const onSubmit = async (data) => {
  try {
    setLoading(true);

    const formData = new FormData();

    /* =========================
       NORMAL FIELDS
    ========================= */
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "profileImage" &&
        value !== null &&
        value !== undefined
      ) {
        formData.append(key, value);
      }
    });

    /* =========================
       IMAGE FIELD
    ========================= */
    if (data.profileImage instanceof File) {
      formData.append("profileImage", data.profileImage);
    }

    /* =========================
       API CALL
    ========================= */
    const res = await API.put("/me/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    /* =========================
       SUCCESS
    ========================= */
    toast.success(
      res?.data?.message || "Profile updated successfully"
    );

    dispatch(fetchUser());

  } catch (error) {
    console.error("Update Profile Error:", error);

    const errData = error?.response?.data;

    const message = errData?.message || "Update failed";
    const field = errData?.field;

    /* =========================
       FIELD BASED ERROR TOAST
    ========================= */
    if (field) {
      toast.error(`${message} (${field})`);
    } else {
      toast.error(message);
    }

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
          preview={preview}
          master={{}}
          handleFileChange={
            handleImageChange
          }
          showPassword={showPassword}
          setShowPassword={
            setShowPassword
          }
          loading={loading}
          buttonText="Update Profile"
          isEdit={true}
        />

      </form>
    </FormProvider>
  );
};

export default UpdateProfileForm;