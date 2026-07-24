"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import API from "../../utils/axiosInstance";

// ================= COMPONENT =================

export default function UpdatePassword() {
  const router = useRouter();

  // ================= STATES =================

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    const { newPassword, confirmPassword } = form;

    // Empty field validation

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");

      return false;
    }

    // Strong password regex

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must contain uppercase, lowercase, number & special character",
      );

      return false;
    }

    // Confirm password validation

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return false;
    }

    return true;
  };

  // ================= UPDATE PASSWORD FUNCTION =================

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // validation

    if (!validateForm()) return;

    try {
      setLoading(true);

      // ================= API CALL =================

      const res = await API.put("/password/update", form);

      // ================= SUCCESS =================

      toast.success(
        res?.data?.message || "Password updated successfully",
      );

      // ================= RESET FORM =================

      setForm({
        newPassword: "",
        confirmPassword: "",
      });

      // ================= REDIRECT =================

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Update Password Error:", error);

      // ================= ERROR =================

      toast.error(
        error?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Officer Account Security
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Update Password
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Create a strong password to protect your official portal
                  account.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Security Status
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck size={16} />
                  Protected Access
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Account Security</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Update Password
            </span>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
          <aside className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#0b3a6f] px-4 py-3">
                <h2 className="text-sm font-bold text-white">
                  Password Security
                </h2>

                <p className="mt-0.5 text-xs text-blue-100">
                  Follow the required security rules
                </p>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    Minimum 8 characters
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    At least one uppercase and one lowercase letter
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    At least one number and one special character
                  </p>
                </div>

                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs leading-5 text-amber-800">
                    Never share your password with anyone. Use a unique password
                    for your official account.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                  <Lock className="h-5 w-5 text-blue-800" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Set New Password
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter and confirm your new account password.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleUpdatePassword}
              className="space-y-5 p-4 sm:p-5 lg:p-6"
            >
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  New Password
                </label>

                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-blue-800"
                    aria-label={
                      showPassword.new
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showPassword.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Password must contain uppercase, lowercase, number and special
                  character.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Confirm Password
                </label>

                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-blue-800"
                    aria-label={
                      showPassword.confirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs leading-5 text-blue-800">
                  After successful password update, you will be redirected to
                  the home page.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Officer Account Security • Official Administration Portal
        </footer>
      </div>
    </div>
  );
}