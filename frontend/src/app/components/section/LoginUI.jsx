

"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";

import NavigationLinks from "../../components/section/ui/NavigationLinks";

export default function LoginUI({ onSubmit, loading }) {
  const pathname = usePathname();
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-3 py-4 overflow-y-auto">
      <div className="w-full max-w-[850px] bg-white rounded-2xl sm:rounded-[24px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-200">

        {/* BRAND SECTION */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-7 sm:px-8 lg:px-9 lg:py-8 text-white flex flex-col justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs mb-6">
              <ShieldCheck size={14} />
              Secure Government Login Portal
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Building2 size={30} />
              </div>

              <h1 className="text-3xl sm:text-[32px] font-bold leading-tight">
                Appraisal Management System
              </h1>

              <p className="text-slate-300 text-sm sm:text-[15px] leading-6 max-w-md">
                A secure and centralized platform for employee appraisal,
                performance review, officer assessment, and final evaluation
                workflow.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <BadgeCheck size={21} className="mb-2" />
              <p className="text-sm font-semibold">Role Based Access</p>
              <p className="text-xs text-slate-300 mt-1">
                Employee & Officer Login
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <Lock size={21} className="mb-2" />
              <p className="text-sm font-semibold">Secure Session</p>
              <p className="text-xs text-slate-300 mt-1">
                Protected authentication
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            © Appraisal Management System. All rights reserved.
          </p>
        </div>

        {/* LOGIN SECTION */}
        <div className="flex items-center justify-center px-5 py-7 sm:px-8 lg:px-10 lg:py-8">
          <form onSubmit={onSubmit} className="w-full max-w-[380px] space-y-4">

            <div className="text-center lg:text-left">
              <div className="mx-auto lg:mx-0 mb-3 w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <ShieldCheck size={30} />



              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {isHome
                  ? "Officer Login"
                  : isLogin
                    ? "Employee Login"
                    : "Login"}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Sign in to access Appraisal Management System
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email or Phone Number
              </label>

              <input
                type="text"
                {...register("identifier")}
                placeholder="Enter email or phone number"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 pr-12 transition placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>

              <span className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white
  bg-blue-700 hover:bg-blue-800 active:bg-blue-900
  disabled:opacity-70 disabled:cursor-not-allowed
  shadow-lg shadow-blue-700/20 transition-all duration-200"
            >
              {loading
                ? "Authenticating..."
                : isHome
                  ? "Officer Login"
                  : isLogin
                    ? "Employee Login"
                    : "Sign In"}
            </button>
            <div className="pt-1" onClick={(e) => e.preventDefault()}>
              <NavigationLinks />
            </div>

            <div className="border-t border-slate-200 pt-4 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <Lock size={13} />
                Secure encrypted login session
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}