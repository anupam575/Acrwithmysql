"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Employeedropdown from "../../components/section/EmployeeForm";
import OfficerDropdown from "../../components/section/ui/OfficerDropdown";
import DynamicSection from "../../components/section/ui/DynamicSection";
import { getDateRange, validateDateRange } from "../../../utils/dateUtils";
import DesignationMultiSelect from "../../components/section/ui/designation";
const Input = ({ label, error, ...props }) => (
  <div className="min-w-0 space-y-1.5">
    <label className="block text-[13px] font-semibold text-slate-700">
      {label}
    </label>

    <input
      {...props}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2
      text-sm text-slate-900 shadow-sm outline-none transition duration-150
      placeholder:text-slate-400 hover:border-slate-400 focus:border-[#1d4f91]
      focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100`}
    />

    {error && (
      <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
        {error}
      </p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <section className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
      <span className="h-5 w-1 rounded-full bg-[#d97706]" aria-hidden="true" />
      <h3 className="text-[15px] font-bold text-slate-800 sm:text-base">
        {title}
      </h3>
    </div>
    <div className="space-y-4 p-4 sm:p-5">{children}</div>
  </section>
);
const EmployeeForm = ({
  showPassword,
  setShowPassword,
  loading,
  buttonText,
  isEdit = false,
  officers,
  master,
      handleBack,

}) => {
  const {
   register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  /* ================= STYLES ================= */

  const inputClass =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm " +
    "text-slate-900 shadow-sm outline-none transition duration-150 placeholder:text-slate-400 " +
    "hover:border-slate-400 focus:border-[#1d4f91] focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-[13px] font-semibold text-slate-700";

  const errorClass = "mt-1.5 text-xs font-medium text-rose-600";

  return (
    <div className="government-employee-form min-h-full bg-[#f4f7fb] px-2.5 py-3 sm:px-4 sm:py-5 lg:px-6">
      <style jsx global>{`
        .government-employee-form select {
          height: 40px !important;
          border-radius: 6px !important;
          border-color: #cbd5e1 !important;
          font-size: 14px !important;
          color: #334155 !important;
          background-color: #fff !important;
        }
        .government-employee-form select:focus {
          border-color: #1d4f91 !important;
          box-shadow: 0 0 0 2px rgba(29,79,145,.12) !important;
        }
        .government-employee-form button { font-size: 13px; }
        .government-employee-form section { scroll-margin-top: 16px; }
        .government-employee-form input,
        .government-employee-form select,
        .government-employee-form button { line-height: 1.25; }
        .government-employee-form label { color: #334155; }
        .government-employee-form [class*="rounded-xl"] { border-radius: 8px; }
        .government-employee-form [class*="space-y-6"] { row-gap: 16px; }
        @media (max-width: 640px) {
          .government-employee-form input,
          .government-employee-form select { font-size: 16px !important; }
        }
      `}</style>
      <div className="mx-auto max-w-[1180px] space-y-4">
        <header className="overflow-hidden rounded-lg border border-[#1d4f91]/20 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-[#123d72] to-[#1d5b9f] px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">
                Employee Management System
              </p>
              <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                {isEdit ? "Update Employee Profile" : "Create Employee Profile"}
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                Enter employee service details, reporting authorities, qualifications, training and leave information.
              </p>
            </div>
            <div className="hidden rounded-md border border-white/20 bg-white/10 px-3 py-2 text-right sm:block">
             <button
  type="button"
  onClick={handleBack}
  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  </svg>

  Back
</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-white px-4 py-2 text-xs text-slate-500 sm:px-6">
            <span>Home</span><span>/</span><span>Employee Management</span><span>/</span>
            <span className="font-semibold text-[#1d4f91]">{isEdit ? "Update Profile" : "Create Profile"}</span>
          </div>
        </header>
      
      {/* ================= BASIC INFO ================= */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Employee Code" {...register("employeeCode")} />

          <Input
            label="Employee Name"
            {...register("employee_name")}
            error={errors?.employee_name?.message}
          />


    <Input
      label="Phone Number"
      type="tel"
      placeholder="Enter Phone Number"
      {...register("phoneNumber", {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit phone number",
        },
      })}
      error={errors?.phoneNumber?.message}
    />
    <DesignationMultiSelect master={master} />

          <Input
            label="Pay Scale"
            {...register("pay_scale")}
            error={errors?.pay_scale?.message}
          />

          <Input
            label="Basic Pay"
            type="number"
            {...register("basic_pay")}
            error={errors?.basic_pay?.message}
          />

          <Input type="date" label="DOB" {...register("date_of_birth")} />
          <Input type="date" label="Joining" {...register("date_of_joining")} />
          <Input
            type="date"
            label="Appointment"
            {...register("date_of_appointment")}
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors?.email?.message}
          />
          {!isEdit && (
            <>
              {/* PASSWORD */}
              <div className="min-w-0">
                <label className={labelClass}>Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`${inputClass} pr-14`}
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-1.5 right-1.5 inline-flex w-10 items-center justify-center rounded-lg text-base text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    👁
                  </button>
                </div>

                {errors.password && (
                  <p className={errorClass}>{errors.password.message}</p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="min-w-0">
                <label className={labelClass}>Confirm Password</label>

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={inputClass}
                  placeholder="Confirm password"
                />

                {errors.confirmPassword && (
                  <p className={errorClass}>{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <Employeedropdown
            master={master}
            fields={[
              {
                name: "role",
                optionsKey: "roles",
                placeholder: "Select Role",
              },
              
              {
                name: "category",
                optionsKey: "categories",
                placeholder: "Select Category",
              },
            ]}
          />
        </div>
      </Section>
      {/* ================= REPORTING AUTHORITY ================= */}
      <DynamicSection
        title="Reporting Officer"
        name="authorities.reporting"
        defaultItem={{
          name: "",
          designation: "",
          department: "",
          from: "",
          to: "",
        }}
      >
        {(index) => {
          const reportingFromDate = watch(
            `authorities.reporting.${index}.from`,
          );

          return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OfficerDropdown
                label="Reporting Officer"
                name={`authorities.reporting.${index}.name`}
                control={control}
                options={officers.reportingOfficers}
                loading={officers.loading}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.reporting.${index}.designation`,
                    optionsKey: "designations",
                    placeholder: "Select Designation",
                  },
                ]}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.reporting.${index}.department`,
                    optionsKey: "departments",
                    placeholder: "Select Department",
                  },
                ]}
              />

              <Input
                label="From Date"
                type="date"
                {...register(`authorities.reporting.${index}.from`, {
                  valueAsDate: true,
                })}
              />

              <Input
                label="To Date"
                type="date"
                {...getDateRange(reportingFromDate)}
                {...register(`authorities.reporting.${index}.to`, {
                  valueAsDate: true,
                  validate: (value) =>
                    validateDateRange(reportingFromDate, value),
                })}
                error={errors?.authorities?.reporting?.[index]?.to?.message}
              />
            </div>
          );
        }}
      </DynamicSection>

      {/* ================= REVIEWING AUTHORITY ================= */}
      <DynamicSection
        title="Reviewing Officer"
        name="authorities.reviewing"
        defaultItem={{
          name: "",
          designation: "",
          department: "",
          from: "",
          to: "",
        }}
      >
        {(index) => {
          const fromDate = watch(`authorities.reviewing.${index}.from`);
          const dateRange = getDateRange(fromDate, 3);

          return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OfficerDropdown
                label="Reviewing Officer"
                name={`authorities.reviewing.${index}.name`}
                control={control}
                options={officers.reviewingOfficers}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.reviewing.${index}.designation`,
                    optionsKey: "designations",
                    placeholder: "Select Designation",
                  },
                ]}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.reviewing.${index}.department`,
                    optionsKey: "departments",
                    placeholder: "Select Department",
                  },
                ]}
              />

              <Input
                label="From Date"
                type="date"
                {...register(`authorities.reviewing.${index}.from`, {
                  valueAsDate: true,
                })}
              />

              <Input
                label="To Date"
                type="date"
                min={dateRange.min}
                {...register(`authorities.reviewing.${index}.to`, {
                  valueAsDate: true,
                  validate: (value) => validateDateRange(fromDate, value, 3),
                })}
              />
            </div>
          );
        }}
      </DynamicSection>
    


      <DynamicSection
        title="Accepting Officer"
        name="authorities.accepting"
        defaultItem={{
          name: "",
          designation: "",
          department: "",
          from: "",
          to: "",
        }}
      >
        {(index) => {
          const fromDate = watch(`authorities.accepting.${index}.from`);
          const dateRange = getDateRange(fromDate, 3);

          return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OfficerDropdown
                label="Accepting Officer"
                name={`authorities.accepting.${index}.name`}
                control={control}
                options={officers.acceptingOfficers}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.accepting.${index}.designation`,
                    optionsKey: "designations",
                    placeholder: "Select Designation",
                  },
                ]}
              />

              <Employeedropdown
                master={master}
                fields={[
                  {
                    name: `authorities.accepting.${index}.department`,
                    optionsKey: "departments",
                    placeholder: "Select Department",
                  },
                ]}
              />

              <Input
                label="From Date"
                type="date"
                {...register(`authorities.accepting.${index}.from`, {
                  valueAsDate: true,
                })}
              />

              <Input
                label="To Date"
                type="date"
                min={dateRange.min}
                {...register(`authorities.accepting.${index}.to`, {
                  valueAsDate: true,
                  validate: (value) => validateDateRange(fromDate, value, 3),
                })}
              />
            </div>
          );
        }}
      </DynamicSection>

      <DynamicSection
        title="Education Qualification"
        name="educationalProfessionalQualifications.education"
        defaultItem={{ title: "", institution: "", year: "" }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Title"
              {...register(
                `educationalProfessionalQualifications.education.${index}.title`,
              )}
              error={
                errors?.educationalProfessionalQualifications?.education?.[
                  index
                ]?.title?.message
              }
            />

            <Input
              label="Institution"
              {...register(
                `educationalProfessionalQualifications.education.${index}.institution`,
              )}
              error={
                errors?.educationalProfessionalQualifications?.education?.[
                  index
                ]?.institution?.message
              }
            />

            <Input
              label="Year"
              type="number"
              {...register(
                `educationalProfessionalQualifications.education.${index}.year`,
              )}
              error={
                errors?.educationalProfessionalQualifications?.education?.[
                  index
                ]?.year?.message
              }
            />
          </div>
        )}
      </DynamicSection>

      <DynamicSection
        title="Professional Qualification"
        name="educationalProfessionalQualifications.professional"
        defaultItem={{ title: "", institution: "", year: "" }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Title"
              {...register(
                `educationalProfessionalQualifications.professional.${index}.title`,
              )}
            />
            <Input
              label="Institution"
              {...register(
                `educationalProfessionalQualifications.professional.${index}.institution`,
              )}
            />
            <Input
              label="Year"
              type="number"
              {...register(
                `educationalProfessionalQualifications.professional.${index}.year`,
              )}
            />
          </div>
        )}
      </DynamicSection>

      <DynamicSection
        title="Basic Trainings"
        name="basicTrainings"
        defaultItem={{ name: "", institute: "", from: "", to: "" }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
            <Input
              label="Training Name"
              {...register(`basicTrainings.${index}.name`)}
            />
            <Input
              label="Institute"
              {...register(`basicTrainings.${index}.institute`)}
            />
            <Input
              type="date"
              label="From"
              {...register(`basicTrainings.${index}.from`)}
            />
            <Input
              type="date"
              label="To"
              {...register(`basicTrainings.${index}.to`)}
            />
          </div>
        )}
      </DynamicSection>

      <DynamicSection
        title="Basic Leaves"
        name="basicLeaves"
        defaultItem={{
          type: "",
          from: "",
          to: "",
          reason: "",
          remarks: "",
        }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
            <Input label="Type" {...register(`basicLeaves.${index}.type`)} />
            <Input
              type="date"
              label="From"
              {...register(`basicLeaves.${index}.from`)}
            />
            <Input
              type="date"
              label="To"
              {...register(`basicLeaves.${index}.to`)}
            />
            <Input
              label="Reason"
              {...register(`basicLeaves.${index}.reason`)}
            />
            <Input
              label="Remarks"
              {...register(`basicLeaves.${index}.remarks`)}
            />
          </div>
        )}
      </DynamicSection>

      <Section title="Other Details">
        <Input
          label="Details"
          {...register("educationalProfessionalQualifications.otherDetails")}
        />
      </Section>
        <div className="sticky bottom-0 z-10 -mx-2.5 border-t border-slate-300 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur sm:static sm:mx-0 sm:rounded-lg sm:border sm:px-5 sm:shadow-sm">
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-[11px] leading-4 text-slate-500 sm:text-left sm:text-xs">
              Please verify all mandatory and service-related information before submission.
            </p>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#163f75] bg-[#1d4f91] px-7 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-[#163f75] focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-auto sm:min-w-40"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
