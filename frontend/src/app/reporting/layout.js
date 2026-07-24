"use client";

import DashboardLayout from "../components/DashboardLayout";
import { reportingMenu } from "../components/menuItems/reportingMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Reprting({ children }) {
  return (
    <ProtectedRoute allowedRoles={["reporting"]}> {/* ✅ FIXED */}
      <DashboardLayout
        menuItems={reportingMenu}
        title="Reporting Dashboard"
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// "use client";

// import DashboardLayout from "../components/DashboardLayout";
// import { reportingMenu } from "../components/menuItems/reportingMenu";
// export default function Reporting({ children }) {
//   return (
//     <DashboardLayout
//       menuItems={reportingMenu}
//       title="Reporting Dashboard"
//     >
//       {children}
//     </DashboardLayout>
//   );
// }