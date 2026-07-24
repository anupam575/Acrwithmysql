"use client";

import DashboardLayout from "../components/DashboardLayout";
import { hodMenu } from "../components/menuItems/hodMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HODLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["hod"]}>
      <DashboardLayout
        menuItems={hodMenu}
        title="HOD Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}