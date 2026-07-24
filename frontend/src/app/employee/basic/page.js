// app/profile/page.jsx

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailProfile from "../components/DetailProfile";
import EmployeeProfile from "../components/basic";
import { fetchUser } from "../../../redux/slices/authslice";

export default function Page() {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  // 🔥 FETCH CURRENT USER
  useEffect(() => {
    if (!user?._id) {
      dispatch(fetchUser());
    }
  }, [dispatch, user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No User Found
      </div>
    );
  }

  // 🔥 ONLY CURRENT USER ID PASS
  const userId = user._id;

  // 🔥 CATEGORY LOGIC
  const categoryName = user?.category?.name?.toLowerCase() || "";

  const isSenior = categoryName.includes("senior and top managerial level");
  const isBasic = categoryName.includes("supervisory and below supervisory category employees");

  if (isSenior) {
    return <DetailProfile userId={userId} />;
  }

  if (isBasic) {
    return <EmployeeProfile userId={userId} />;
  }

  return <EmployeeProfile userId={userId} />;
}