
"use client";



import DashboardLayout from "../components/DashboardLayout";
import { empMenu } from "../components/menuItems/empMenu";
import ProtectedRoute from "../components/ProtectedRoute"; // ✅ import

export default function EmployeeLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["emp"]}>
      <DashboardLayout
        menuItems={empMenu}
        title="Employee Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}