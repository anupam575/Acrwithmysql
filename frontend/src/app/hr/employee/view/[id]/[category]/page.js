"use client";

import { useParams } from "next/navigation";

import DetailProfile from "../../../../../employee/components/DetailProfile";
import EmployeeProfile from "../../../../../employee/components/basic";

export default function Page() {

  const params = useParams();

  const userId = params.id;

  const categoryKey = params.category;

  console.log("CATEGORY KEY:", categoryKey);


  const isSenior = categoryKey === "senior and top managerial level";

  const isBasic =
    categoryKey === "supervisory and below supervisory category employees";

  // =========================
  // RENDER
  // =========================
  if (isSenior) {
    return (
      <DetailProfile userId={userId} />
    );
  }

  if (isBasic) {
    return (
      <EmployeeProfile userId={userId} />
    );
  }

  // DEFAULT
  return (
    <EmployeeProfile userId={userId} />
  );
}