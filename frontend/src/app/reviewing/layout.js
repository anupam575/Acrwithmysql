"use client";

import DashboardLayout from "../components/DashboardLayout";
import { reviewingMenu } from "../components/menuItems/reviewingMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Reviewing({ children }) {
  return (
    <ProtectedRoute allowedRoles={["reviewing"]}> {/* ✅ FIXED */}
      <DashboardLayout
        menuItems={reviewingMenu}
        title="Reviewing Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}