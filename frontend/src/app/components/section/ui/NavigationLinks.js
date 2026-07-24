"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export default function NavigationLinks() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";

  return (
    <div className="flex justify-center mt-6">

      {/* HOME → EMPLOYEE LOGIN */}
      {isHome && (
        <button
          onClick={() => router.push("/login")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-700
          bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border border-gray-200
          shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
        >
          <LoginRoundedIcon className="text-blue-600" fontSize="small" />

          <span className="group-hover:underline underline-offset-4">
            Employee Login
          </span>
        </button>
      )}

      {/* LOGIN → HOME */}
      {isLogin && (
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-sm font-medium text-gray-600
          bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200
          shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
        >
          <HomeRoundedIcon fontSize="small" />

          <span className="group-hover:underline underline-offset-4">
            Officers Login
          </span>
        </button>
      )}

    </div>
  );
}