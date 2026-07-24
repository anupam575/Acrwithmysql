"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export const getCurrentFinancialYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

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

function SectionCard({ number, title, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
        <div className="flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-800 px-2 text-xs font-bold text-white">
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
            Section {number}
          </p>

          <h3 className="mt-0.5 text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}

function Input({
  type = "text",
  register,
  name,
  placeholder,
  step,
  value,
  readOnly = false,
  className = "",
}) {
  return (
    <input
      type={type}
      step={step}
      value={value || ""}
      readOnly={readOnly}
      {...register(name)}
      placeholder={placeholder}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
}

function RadioOptions({ register, name }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {["Yes", "No"].map((option) => (
        <label key={option} className="cursor-pointer">
          <input
            type="radio"
            value={option}
            {...register(name)}
            className="peer sr-only"
          />

          <div className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 peer-checked:border-blue-800 peer-checked:bg-blue-800 peer-checked:text-white">
            {option}
          </div>
        </label>
      ))}
    </div>
  );
}

const AcceptanceSectionForm = ({ onSubmit }) => {
  const { register, formState, setValue, watch } = useFormContext();
  const { isSubmitting } = formState;

  useEffect(() => {
    const fy = getCurrentFinancialYear();

    setValue("financialYear", fy);

    console.log("Financial Year Set:", fy);
  }, [setValue]);

  const signatureFile = watch("officerSignature");

  const { url: signatureUrl } = useObjectUrl(signatureFile);

  const financialYear = watch("financialYear");

  console.log("Financial Year Watch:", financialYear);

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1280px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Performance Appraisal Report
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Section V – Acceptance by the Accepting Authority
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review the assessment, record acceptance remarks, assign the
                  final grade, and complete the accepting authority details.
                </p>
              </div>

              <div className="shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                Accepting Authority
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>PAR Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Section V</span>
          </div>
        </header>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 sm:text-sm">
            Please read the relevant instructions attached to the form before
            completing this section.
          </div>

          <SectionCard number="FY" title="Current Financial Year">
            <Input
              register={register}
              name="financialYear"
              value={financialYear}
              readOnly
              className="cursor-not-allowed bg-slate-100 font-semibold text-slate-600"
            />
          </SectionCard>

          <SectionCard
            number="01"
            title="Is the overall grade consistent with the pen picture?"
          >
            <RadioOptions
              register={register}
              name="overallGradeConsistent"
            />
          </SectionCard>

          <SectionCard number="02" title="Do you agree with the remarks?">
            <RadioOptions register={register} name="agreeWithRemarks" />
          </SectionCard>

          <SectionCard number="03" title="Difference of opinion, if any">
            <textarea
              rows={5}
              {...register("differenceOpinion")}
              className="w-full min-h-[130px] resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Record the details of any difference of opinion..."
            />
          </SectionCard>

          <SectionCard number="04" title="Overall grade out of 100">
            <input
              type="number"
              step="0.01"
              {...register("overallGrade")}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Example: 87.50"
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter the final grade with a maximum of two decimal places.
            </p>
          </SectionCard>

          <SectionCard number="05" title="Accepting Authority Signature">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_190px] md:items-start">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-700">
                  Officer Signature
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg"
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

                <p className="text-xs leading-5 text-slate-500">
                  Supported formats: PNG, JPG, and JPEG.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-center">
                <div className="flex h-20 w-40 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
                  {signatureUrl ? (
                    <img
                      src={signatureUrl}
                      alt="Officer Signature"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="px-2 text-center text-[10px] text-slate-400">
                      No Signature Selected
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-500">Signature Preview</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard number="06" title="Name and Designation">
            <input
              type="text"
              {...register("acceptingAuthorityNameDesignation")}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter accepting authority name and designation"
            />
          </SectionCard>

          <div className="sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <p className="mb-3 text-xs leading-5 text-slate-500 sm:mb-0">
              Verify all acceptance details, grade, signature, and designation
              before final submission.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-40"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Performance Appraisal Record • Acceptance by Accepting Authority
        </footer>
      </div>
    </div>
  );
};

export default AcceptanceSectionForm;