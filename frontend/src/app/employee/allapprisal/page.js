"use client";

import { useSelector } from "react-redux";

import AppraisalFunction from "../components/AppraisalFunction";
import SupervisorList from "../components/SupervisorList";

export default function Page() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  const categoryKey = user?.category?.category_key;

  switch (categoryKey) {
    case "senior and top managerial level":
      return <AppraisalFunction />;

    case "supervisory and below supervisory category employees":
      return <SupervisorList />;

    default:
      return <div>No Category Found</div>;
  }
}