"use client";

import { useSelector } from "react-redux";

import UpdateSelfAppraisal from "../../../components/UpdateSelfAppraisal";
import EditSupervisor from "../../../components/EditSuperviso";

export default function Page() {
  const { user, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  switch (
    user?.category?.category_key
  ) {
    case "senior and top managerial level":
      return <UpdateSelfAppraisal />;

    case "supervisory and below supervisory category employees":
      return <EditSupervisor />;

    default:
      return <div>No Category Found</div>;
  }
}