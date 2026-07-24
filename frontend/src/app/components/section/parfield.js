"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Employeedropdown from "../../components/section/EmployeeForm";
import OfficerDropdown from "../../components/section/ui/OfficerDropdown";
import DynamicSection from "../../components/section/ui/DynamicSection";
import { getDateRange, validateDateRange } from "../../../utils/dateUtils";
import DesignationMultiSelect from "../../components/section/ui/designation";
export function useObjectUrl(file) {
  const [url, setUrl] = React.useState(null);
  const [type, setType] = React.useState(null);

  React.useEffect(() => {
    let objectUrl;

    if (!file) {
      setUrl(null);
      setType(null);
      return;
    }

    // Backend object
    if (
      typeof file === "object" &&
      !(file instanceof File) &&
      !(file instanceof Blob)
    ) {
      setUrl(file?.url || null);
      setType(file?.mimeType || null);
      return;
    }

    // String URL
    if (typeof file === "string") {
      setUrl(file);
      setType(null);
      return;
    }

    // File / Blob
    if (file instanceof File || file instanceof Blob) {
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      setType(file.type);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return { url, type };
}

// ================= INPUT =================
const Input = ({ label, error, ...props }) => (
  <div className="min-w-0 space-y-1.5">
    <label className="block text-[13px] font-semibold leading-5 text-slate-700">
      {label}
    </label>

    <input
      {...props}
      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
    />

    {error && (
      <p className="text-xs font-medium leading-4 text-red-600">{error}</p>
    )}
  </div>
);

// ================= TEXTAREA =================
const Textarea = ({ label, error, ...props }) => (
  <div className="min-w-0 space-y-1.5">
    <label className="block text-[13px] font-semibold leading-5 text-slate-700">
      {label}
    </label>

    <textarea
      {...props}
      className="min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
    />

    {error && (
      <p className="text-xs font-medium leading-4 text-red-600">{error}</p>
    )}
  </div>
);

// ================= SELECT =================
const Select = ({ label, children, ...props }) => (
  <div className="min-w-0 space-y-1.5">
    <label className="block text-[13px] font-semibold leading-5 text-slate-700">
      {label}
    </label>

    <select
      {...props}
      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
    >
      {children}
    </select>
  </div>
);

// ================= SECTION CARD =================
const Section = ({ title, children }) => (
  <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex min-h-11 items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-5">
      <span className="mr-2 h-5 w-1 rounded-full bg-blue-800" aria-hidden="true" />
      <h2 className="text-sm font-bold tracking-[0.01em] text-slate-900 sm:text-[15px]">
        {title}
      </h2>
    </div>

    <div className="space-y-5 p-4 sm:p-5 lg:p-6">{children}</div>
  </section>
);

// ================= MAIN COMPONENT =================

const PARFormFields = ({
  master,
  officers,
  showPassword,
  setShowPassword,
  loading,
  buttonText,
    handleBack,

  isEdit = false,
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const recentPhoto = watch("recentPhotograph");
  const medicalFile = watch("medicalExamination.reportDocument");
  const signatureFile = watch("officerSignature");

  const { url: photoUrl } = useObjectUrl(recentPhoto);
  const { url: medicalUrl, type: medicalType } = useObjectUrl(medicalFile);
  const { url: signatureUrl } = useObjectUrl(signatureFile);

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1440px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Personnel Administration &amp; Records
                </p>
                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Performance Appraisal Record
                </h1>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Enter employee profile, appointment, authority, absence, training and service-related information.
                </p>
              </div>

              <div className="shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
<button
  type="button"
  onClick={handleBack}
  className="
    px-5 py-2.5
    rounded-full
    bg-slate-900 text-white
    text-sm font-medium
    hover:bg-slate-800
    transition
  "
>
  ← Back
</button>              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span aria-hidden="true">/</span>
            <span>Employee Management</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-blue-800">PAR Form</span>
          </div>
        </header>

        <main
          className="space-y-4 bg-slate-50 p-3 sm:space-y-5 sm:p-5 lg:p-7
          [&_input[type='file']]:max-w-full
          [&_input[type='file']]:text-xs
          [&_button]:touch-manipulation
          [&_select]:truncate"
        >
      <Section title="Recent Photograph">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Recent Photograph
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("recentPhotograph", file, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              className="block w-full rounded-md border border-slate-300 bg-white text-xs text-slate-600 shadow-sm
                   file:mr-3 file:border-0 file:border-r file:border-slate-300
                   file:bg-slate-100 file:px-4 file:py-2.5
                   file:text-xs file:font-bold file:text-blue-800
                   hover:file:bg-blue-50"
            />
          </div>

          <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md border border-slate-300 bg-slate-100 shadow-sm flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>
        </div>
      </Section>
      {/* ================= BASIC ================= */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Employee Code" {...register("employeeCode")} />
          <Input label="Employee Name" {...register("EmployeeName")} />

          <Input
            type="date"
            label="Date of Birth"
            {...register("dateOfBirth")}
          />
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors?.email?.message}
          />
    <DesignationMultiSelect master={master} />

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

          {!isEdit && (
            <>
              {/* PASSWORD */}
              <div>
                <label className="block text-[13px] font-semibold leading-5 text-slate-700">
                  Password
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="h-10 w-10 shrink-0 rounded-md border border-slate-300 bg-slate-50 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    👁
                  </button>
                </div>

                {errors?.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-[13px] font-semibold leading-5 text-slate-700">
                  Confirm Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  placeholder="Confirm password"
                />

                {errors?.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <Textarea
          label="Academic / Professional Qualifications"
          {...register("academicProfessionalQualifications")}
        />

        <div className="pt-1"><Section title="Present Post">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input label="Level" {...register("currentPost.grade")} />

            <Input label="Pay Scale" {...register("currentPost.payScale")} />

            <Input
              type="date"
              label=" Appointment Date"
              {...register("currentPost.nsfdcAppointmentDate")}
            />
          </div>
        </Section></div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
          {/* DROPDOWN CARD */}
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

      {/* ================= FIRST APPOINTMENT ================= */}
      <Section title="First Public Enterprise Appointment">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            type="date"
            label="Date"
            {...register("firstPublicEnterpriseAppointment.date")}
          />
          <Input
            label="Pay Scale"
            {...register("firstPublicEnterpriseAppointment.payScale")}
          />
        </div>
      </Section>
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
        title="Absence Records"
        name="absenceRecords"
        defaultItem={{
          from: null,
          to: null,
          category: "Leave",
          leaveType: "",
          specify: "",
          remarks: "",
        }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="From Date"
              type="date"
              {...register(`absenceRecords.${index}.from`, {
                valueAsDate: true,
              })}
            />

            <Input
              label="To Date"
              type="date"
              {...register(`absenceRecords.${index}.to`, {
                valueAsDate: true,
              })}
            />

            <Select
              label="Category"
              {...register(`absenceRecords.${index}.category`)}
            >
              <option value="Leave">Leave</option>
              <option value="Others">Others</option>
            </Select>

            <Select
              label="Leave Type"
              {...register(`absenceRecords.${index}.leaveType`)}
            >
              <option value="">Select Leave Type</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
              <option>Medical Leave</option>
              <option>Other</option>
            </Select>

            <Input
              label="Specify (if Others)"
              placeholder="Enter details"
              {...register(`absenceRecords.${index}.specify`)}
            />

            <Textarea
              label="Remarks"
              placeholder="Enter remarks"
              {...register(`absenceRecords.${index}.remarks`)}
            />
          </div>
        )}
      </DynamicSection>

      {/* ================= CURRENT POST ================= */}

      <DynamicSection
        title="Training Programs"
        name="trainingPrograms"
        defaultItem={{
          from: "",
          to: "",
          institute: "",
          subject: "",
        }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="From Date"
              type="date"
              {...register(`trainingPrograms.${index}.from`, {
                valueAsDate: true,
              })}
            />

            <Input
              label="To Date"
              type="date"
              {...register(`trainingPrograms.${index}.to`, {
                valueAsDate: true,
              })}
            />

            <Input
              label="Institute"
              placeholder="Enter institute name"
              {...register(`trainingPrograms.${index}.institute`)}
            />

            <Input
              label="Subject"
              placeholder="Enter subject"
              {...register(`trainingPrograms.${index}.subject`)}
            />
          </div>
        )}
      </DynamicSection>

      <DynamicSection
        title="Awards"
        name="awards"
        defaultItem={{
          title: "",
          description: "",
          year: null,
        }}
      >
        {(index) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Award Title"
              placeholder="Enter title"
              {...register(`awards.${index}.title`)}
            />

            <Textarea
              label="Description"
              placeholder="Enter description"
              {...register(`awards.${index}.description`)}
            />

            <Input
              label="Year"
              type="number"
              placeholder="Enter year"
              {...register(`awards.${index}.year`, {
                valueAsNumber: true,
              })}
            />
          </div>
        )}
      </DynamicSection>

      {/* ================= OTHER ================= */}
      <Section title="Other Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            type="number"
            label="Officers Not Reported PAR"
            {...register("officersNotReportedPAR")}
          />
          <Input
            type="date"
            label="Property Return Date"
            {...register("propertyReturnDate")}
          />
          <Input
            type="number"
            label="Property Return Year"
            {...register("propertyReturnYear")}
          />
        </div>
      </Section>
      {/* 
      <Section title="Medical Examination">
        <Input
          type="date"
          label="Medical Date"
          {...register("medicalExamination.date")}
        />

        <Textarea
          label="Report Summary"
          {...register("medicalExamination.reportSummary")}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Medical Report (PDF/Image)
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("medicalExamination.reportDocument", file, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
            className="block w-full text-sm text-gray-600
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
          />

          {medicalUrl &&
            (medicalType?.startsWith("image/") ? (
              <img src={medicalUrl} className="w-full h-40 object-contain" />
            ) : medicalType === "application/pdf" ? (
              <iframe src={medicalUrl} className="w-full h-40" />
            ) : (
              <a href={medicalUrl} target="_blank">
                Open File
              </a>
            ))}
        </div>
      </Section> */}

      <Section title="Signature">
        <div className="flex items-center gap-6">
          {/* LEFT: UPLOAD */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Officer Signature (Image)
            </label>

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("officerSignature", file, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              className="block w-full rounded-md border border-slate-300 bg-white text-xs text-slate-600 shadow-sm
        file:mr-3 file:border-0 file:border-r file:border-slate-300
        file:bg-slate-100 file:px-4 file:py-2.5
        file:text-xs file:font-bold file:text-blue-800
        hover:file:bg-blue-50"
            />
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-36 overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm flex items-center justify-center">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-gray-400 text-center px-2">
                  No Signature
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">Preview</p>
          </div>
        </div>
      </Section>

      {/* ================= PERSONNEL =================
      <Section title="Personnel Officer">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input label="Name" {...register("personnelOfficer.name")} />
          <Input
            label="Designation"
            {...register("personnelOfficer.designation")}
          />
        </div>
      </Section> */}

      <div className="sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <p className="mb-3 text-xs leading-5 text-slate-500 sm:mb-0">
          Please verify all entered information before submitting the form.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-40"
        >
          {loading ? (isEdit ? "Updating..." : "Submitting...") : buttonText}
        </button>
      </div>
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:px-6 sm:text-xs">
          This is an official employee record form. Fields marked as mandatory must be completed before submission.
        </footer>
      </div>
    </div>
  );
};

export default PARFormFields;