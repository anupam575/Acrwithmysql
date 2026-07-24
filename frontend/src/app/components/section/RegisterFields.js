"use client";

import { useFormContext } from "react-hook-form";
import Employeedropdown from "../../components/section/EmployeeForm";

const RegisterFields = ({
  preview,
  master,
  showPassword,
  setShowPassword,
  handleFileChange,
  loading,
  buttonText,
  isEdit = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  const errorClass = "mt-1 text-xs font-medium text-red-600";

  const labelClass =
    "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600";

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Officer Management
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  {isEdit ? "Update Officer" : "Officer Registration"}
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  {isEdit
                    ? "Review and update the officer profile information."
                    : "Create a new officer account with profile, login credentials, role assignment and access permissions."}
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Form Mode
                </p>

                <p className="mt-1 text-sm font-bold">
                  {isEdit ? "Edit Record" : "New Registration"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Officer Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              {isEdit ? "Update Officer" : "Register Officer"}
            </span>
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
          <aside className="lg:sticky lg:top-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#0b3a6f] px-4 py-3">
                <h2 className="text-sm font-bold text-white">
                  Officer Photograph
                </h2>

                <p className="mt-0.5 text-xs text-blue-100">
                  Upload a clear officer profile image
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-44 w-44 overflow-hidden rounded-lg border border-slate-300 bg-slate-50 sm:h-48 sm:w-48">
                      {preview ? (
                        <img
                          src={
                            preview?.startsWith("blob:")
                              ? preview
                              : `https://acrapi.disgenservices.in${preview}`
                          }
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-slate-400">
                          <span className="text-5xl">👤</span>
                          <span className="mt-2 text-xs font-semibold">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <label className="absolute bottom-2 right-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-800 text-white shadow-md transition hover:bg-blue-900">
                      📷

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-sm font-bold text-slate-800">
                    Upload Officer Photograph
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG and JPEG supported
                  </p>
                </div>

                <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs leading-5 text-blue-800">
                    Use a recent passport-style photograph with a clear face and
                    plain background.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <h2 className="text-sm font-bold text-slate-900">
                Officer Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Enter officer identity, contact details, login credentials and department assignment.
              </p>
            </div>

            <div className="p-4 sm:p-5 lg:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className={labelClass}>Officer Code</label>

                  <input
                    {...register("empCode")}
                    className={inputClass}
                    placeholder="Enter officer code"
                  />

                  {errors.empCode && (
                    <p className={errorClass}>{errors.empCode.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Username</label>

                  <input
                    {...register("username")}
                    className={inputClass}
                    placeholder="Enter username"
                  />

                  {errors.username && (
                    <p className={errorClass}>{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>First Name</label>

                  <input
                    {...register("firstName")}
                    className={inputClass}
                    placeholder="Enter first name"
                  />

                  {errors.firstName && (
                    <p className={errorClass}>{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Last Name</label>

                  <input
                    {...register("lastName")}
                    className={inputClass}
                    placeholder="Enter last name"
                  />

                  {errors.lastName && (
                    <p className={errorClass}>{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Email</label>

                  <input
                    type="email"
                    {...register("email")}
                    className={inputClass}
                    placeholder="Enter email"
                  />

                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>

                  <input
                    {...register("phoneNumber")}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />

                  {errors.phoneNumber && (
                    <p className={errorClass}>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {!isEdit && (
                <section className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                  <div className="bg-[#0b3a6f] px-4 py-3">
                    <h3 className="text-sm font-bold text-white">
                      Login Credentials
                    </h3>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Password</label>

                      <div className="flex items-stretch gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          className={`${inputClass} min-w-0 flex-1`}
                          placeholder="Enter password"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="inline-flex min-w-11 items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 text-sm transition hover:bg-slate-200"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          👁
                        </button>
                      </div>

                      {errors.password && (
                        <p className={errorClass}>
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Confirm Password</label>

                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        className={inputClass}
                        placeholder="Confirm password"
                      />

                      {errors.confirmPassword && (
                        <p className={errorClass}>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {!isEdit && (
                <section className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                  <div className="bg-[#0b3a6f] px-4 py-3">
                    <h3 className="text-sm font-bold text-white">
                      Organizational Assignment
                    </h3>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Role</label>

                      <Employeedropdown
                        master={master}
                        fields={[
                          {
                            name: "role",
                            optionsKey: "roles",
                            placeholder: "Select Role",
                          },
                        ]}
                      />

                      {errors.role && (
                        <p className={errorClass}>{errors.role.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Department</label>

                      <Employeedropdown
                        master={master}
                        fields={[
                          {
                            name: "department",
                            optionsKey: "departments",
                            placeholder: "Select Department",
                          },
                        ]}
                      />

                      {errors.department && (
                        <p className={errorClass}>
                          {errors.department.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-blue-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Submitting..."
                  : buttonText}
              </button>
            </div>
          </section>
        </div>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Officer Registration and Profile Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default RegisterFields;