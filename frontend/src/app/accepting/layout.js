"use client";

import DashboardLayout from "../components/DashboardLayout";
import { acceptinngMenu } from "../components/menuItems/acceptingMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Accespting({ children }) {
  return (
    <ProtectedRoute allowedRoles={["accepting"]}> {/* ✅ FIXED */}
      <DashboardLayout
        menuItems={acceptinngMenu}
        title="accepting Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}