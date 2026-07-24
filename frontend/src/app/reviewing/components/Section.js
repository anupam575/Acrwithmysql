"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
  CheckCircle2,
  FileText,
  PenSquare,
  Star,
  Signature,
  User2,
} from "lucide-react";
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

function SectionCard({ number, title, icon, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
        <div className="flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-800 px-2 text-xs font-bold text-white">
          {icon || number}
        </div>

        <div className="min-w-0 flex-1">
          {number && (
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
              Section {number}
            </p>
          )}

          <h3 className="mt-0.5 text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}

/* ---------------- Reusable Inputs ---------------- */

function RadioGroup({ name, register, options = ["Yes", "No"] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => (
        <label key={opt} className="cursor-pointer">
          <input
            type="radio"
            value={opt}
            {...register(name, { required: true })}
            className="hidden peer"
          />

          <div className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 peer-checked:border-blue-800 peer-checked:bg-blue-800 peer-checked:text-white">
            {opt}
          </div>
        </label>
      ))}
    </div>
  );
}

function TextArea({ register, name, placeholder }) {
  return (
    <textarea
      {...register(name)}
      rows={4}
      placeholder={placeholder}
      className="w-full min-h-[130px] resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
    />
  );
}
function Input({
  type = "text",
  register,
  name,
  placeholder,
  step,
  readOnly = false,
  className = "",
}) {
  return (
    <input
      type={type}
      step={step}
      readOnly={readOnly}
      {...register(name)}
      placeholder={placeholder}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
}
/* ---------------- Main Component ---------------- */

export default function SectionIV() {
const { register, formState, setValue, watch } = useFormContext();
const { isSubmitting } = formState;

const signatureFile = watch("officerSignature");

  const { url: signatureUrl } = useObjectUrl(signatureFile);

  useEffect(() => {
    setValue("financialYear", getCurrentFinancialYear());
  }, [setValue]);

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1280px] space-y-4 sm:space-y-5">
        {/* Header */}
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Performance Appraisal Report
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Section IV – Reviewing Authority Assessment
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review the reporting authority assessment and record the final
                  observations of the reviewing authority.
                </p>
              </div>

              <div className="shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                Reviewing Authority
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>PAR Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Section IV</span>
          </div>
        </header>

        <SectionCard number="FY" title="Current Financial Year">
          <Input
            register={register}
            name="financialYear"
            readOnly
            className="cursor-not-allowed bg-slate-100 font-semibold text-slate-600"
          />
        </SectionCard>
        <SectionCard
          number="01"
          title="Do you agree with the assessment made by the Reporting officer with respect to discharge of responsibilities and various attributes of the officer reported upon in Section III? (In case you agree with the assessments made by the Reporting Authority, please make a note to that effect in the space provided for you in Item No.6 and 7 of Section III and initial it.  If you do not agree with any of the numerical assessments made by the Reporting Authority, please record your assessments in the space provided for you in Item No.6 and 7 of Section III and initial your entries)

"
          icon={<CheckCircle2 size={24} />}
        >
          <RadioGroup name="assessmentAgree1" register={register} />
        </SectionCard>

        {/* 2 */}
        <SectionCard
          number="02"
          title="Do you agree with the assessment of the Reporting officer in respect of extraordinary achievements and/or significant shortfalls of the officer reported upon?"
          icon={<Star size={24} />}
        >
          <RadioGroup name="assessmentAgree2" register={register} />
        </SectionCard>

        {/* 3 */}
        <SectionCard
          number="03"
          title="Difference of opinion"
          icon={<FileText size={24} />}
        >
          <TextArea
            register={register}
            name="differenceReason"
            placeholder="Write your detailed comments here..."
          />
        </SectionCard>

        {/* 4 */}
        <SectionCard
          number="04"
          title="Pen picture comments"
          icon={<PenSquare size={24} />}
        >
          <TextArea
            register={register}
            name="penPictureComments"
            placeholder="Describe performance observations..."
          />
        </SectionCard>

        {/* 5 */}
        <SectionCard
          number="05"
          title="Overall grade"
          icon={<Star size={24} />}
        >
          <Input
            type="number"
            step="0.01"
            register={register}
            name="overallGrade"
            placeholder="Enter overall grade"
          />
        </SectionCard>

        {/* 6 */}
       
      <SectionCard number="06" title="Reviewing Authority Signature" icon={<Signature size={18} />}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_190px] md:items-start">
          {/* LEFT: UPLOAD */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-slate-700">
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
          <div className="flex flex-col items-start md:items-center">
            <div className="flex h-20 w-40 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="px-2 text-center text-[10px] text-slate-400">
                  No Signature
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">Preview</p>
          </div>
        </div>
      </SectionCard>


        {/* 7 */}
        <SectionCard
          number="07"
          title="Name & Designation"
          icon={<User2 size={24} />}
        >
          <Input
            register={register}
            name="nameDesignation"
            placeholder="Enter name and designation"
          />
        </SectionCard>

        {/* Submit Button */}
        <div className="sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <p className="mb-3 text-xs leading-5 text-slate-500 sm:mb-0">
            Please review all observations, grade, signature, and designation before submission.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-44"
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Performance Appraisal Record • Reviewing Authority Assessment
        </footer>
      </div>
    </div>
  );
}