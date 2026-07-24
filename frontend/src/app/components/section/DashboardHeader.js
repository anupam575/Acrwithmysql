"use client";

import { useSelector } from "react-redux";
import LogoutButton from "../logout";
import UserDropdown from "./UserDropdown";
import Image from "next/image";
import {
  AccountCircle,
  CalendarMonth,
  Dashboard,
  Menu,
  Shield,
} from "@mui/icons-material";

export default function DashboardHeader({
  title,
  toggleMobileSidebar,
}) {
  const {
    user,
    loading,
    authChecked,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // Loader while auth checking
  if (!authChecked || loading) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-md bg-slate-200" />

          <div>
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </header>
    );
  }

  // Safety: if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // USER NAME
  const displayName =
    user?.officerName ||
    user?.employee_name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    user?.fullName ||
    user?.email ||
    "User";

  // AVATAR
  let avatar = "/default-avatar.png";

  if (user?.profilePic) {
    if (user.profilePic.startsWith("http")) {
      avatar = user.profilePic;
    } else {
      avatar = `https://acrapi.disgenservices.in${user.profilePic}`;
    }
  } else if (user?.avatar) {
    avatar = user.avatar;
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const roleLabel =
  user?.roleName ||
  user?.role?.role_name ||
  user?.role?.role_key ||
  user?.designation ||
  user?.userType ||
  "Authorized User";
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-blue-900 bg-[#0b4a7f] shadow-md">
      <div className="flex h-full items-center gap-3 px-3 sm:px-5 lg:px-6">
        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Open navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
        >
          <Menu fontSize="small" />
        </button>

        {/* LOGO AND PORTAL IDENTITY */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="flex h-11 min-w-[94px] items-center justify-center rounded-md border border-white/20 bg-white px-2 shadow-sm sm:min-w-[118px]">
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={44}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>

          
        </div>

       

        {/* RIGHT SECTION */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* DATE */}
          <div className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 xl:flex">
            <CalendarMonth
              fontSize="small"
              className="text-blue-200"
            />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-blue-200">
                Today
              </p>

              <p className="text-xs font-semibold text-white">
                {currentDate}
              </p>
            </div>
          </div>

          

          {/* USER DROPDOWN */}
          <div className="rounded-md border border-white/15 bg-white/10 p-1 transition hover:bg-white/20">
            <UserDropdown
              user={{
                ...user,
                displayName,
                avatar,
              }}
            />
          </div>

          {/* LOGOUT */}
          <div className="rounded-md border border-white/15 bg-white/10 p-1 transition hover:bg-white/20">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}