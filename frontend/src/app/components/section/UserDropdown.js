"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// MUI ICONS
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

////////////////////////////////////////////////////////////

// ROLE CONFIG
const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    profilePath: "/admin/profile",
    passwordPath: "/admin/password",
  },

  hr: {
    label: "HR",
    profilePath: "/hr/profile",
    passwordPath: "/hr/password",
  },

  accepting: {
    label: "Accepting Officer",
    profilePath: "/accepting/profile",
    passwordPath: "/accepting/password",
  },

  reporting: {
    label: "Reporting Officer",
    profilePath: "/reporting/profile",
    passwordPath: "/reporting/password",
  },

  reviewing: {
    label: "Reviewing Officer",
    profilePath: "/reviewing/profile",
    passwordPath: "/reviewing/password",
  },

  emp: {
    label: "Employee",
    passwordPath: "/employee/password",
  },
   hod: {
    label: "hod Officer",
    profilePath: "/hod/profile",
    passwordPath: "/hod/password",
  },
};

////////////////////////////////////////////////////////////

// GET ROLE DETAILS
const getRoleDetails = (user) => {
  const roleKey =
    user?.role?.role_key?.toLowerCase()?.trim() || "";

  return (
    ROLE_CONFIG[roleKey] || {
      label: roleKey || "User",
      profilePath: "/profile",
      passwordPath: "/password",
    }
  );
};

////////////////////////////////////////////////////////////

// GET USER NAME
const getUserName = (user) => {
  return (
    user?.displayName ||
    user?.officerName ||
    user?.employee_name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User"
  );
};

////////////////////////////////////////////////////////////

// MENU ITEM
const MenuItem = ({ href, icon, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-700 transition last:border-b-0 hover:bg-blue-50 hover:text-[#0b4a7f]"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-[#0b4a7f]">
      {icon}
    </span>

    <span className="font-semibold">{label}</span>
  </Link>
);

////////////////////////////////////////////////////////////

export default function UserDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  if (!user) return null;

  const role = getRoleDetails(user);
  const userName = getUserName(user);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* AVATAR BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Open user menu"
        className="flex items-center gap-2 rounded-md p-1 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <div className="relative">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={userName}
            className="h-10 w-10 rounded-full border-2 border-white/70 object-cover shadow-sm"
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0b4a7f] bg-emerald-400" />
        </div>

        <div className="hidden max-w-[150px] text-left lg:block">
          <p className="truncate text-xs font-bold text-white">
            {userName}
          </p>

          <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wide text-blue-200">
            {role.label}
          </p>
        </div>

        <KeyboardArrowDownIcon
          fontSize="small"
          className={`text-blue-100 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      <div
        className={`absolute right-0 z-[70] mt-3 w-[290px] origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#0b4a7f] px-5 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt={userName}
                className="h-14 w-14 rounded-full border-2 border-white/80 object-cover shadow"
              />

              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0b4a7f] bg-emerald-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {userName}
              </p>

              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                {role.label}
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-wide text-blue-100">
                  Session Active
                </span>
              </div>
            </div>
          </div>
        </div>
<div className="bg-white py-1">
  {role.profilePath && (
    <MenuItem
      href={role.profilePath}
      onClick={() => setOpen(false)}
      icon={<PersonOutlineOutlinedIcon fontSize="small" />}
      label="My Profile"
    />
  )}

  <MenuItem
    href={role.passwordPath}
    onClick={() => setOpen(false)}
    icon={<LockOutlinedIcon fontSize="small" />}
    label="Change Password"
  />
</div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Secure User Session
          </span>

          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>
      </div>
    </div>
  );
}