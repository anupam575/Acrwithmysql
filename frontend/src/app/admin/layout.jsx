"use client";

import DashboardLayout from "../components/DashboardLayout";
import { adminMenu } from "../components/menuItems/adminMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}> {/* ✅ FIXED */}
      <DashboardLayout
        menuItems={adminMenu}
        title="Admin Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// "use client";

// import DashboardLayout from "../components/DashboardLayout";
// import { adminMenu } from "../components/menuItems/adminMenu";

// export default function AdminLayout({ children }) {
//   return (
//     <DashboardLayout
//       menuItems={adminMenu}
//       title="Admin Dashboard"
//     >
//       {children}
//     </DashboardLayout>
//   );
// }