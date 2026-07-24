"use client";

import DashboardLayout from "../components/DashboardLayout";
import { hrMenu } from "../components/menuItems/hrMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HRLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["hr"]}> {/* ✅ FIXED */}
      <DashboardLayout
        menuItems={hrMenu}
        title="HR Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// "use client";

// import DashboardLayout from "../components/DashboardLayout";
// import { hrMenu } from "../components/menuItems/hrMenu";

// export default function HRLayout({ children }) {
//   return (
//     <DashboardLayout
//       menuItems={hrMenu}
//       title="HR Dashboard"
//     >
//       {children}
//     </DashboardLayout>
//   );
// }