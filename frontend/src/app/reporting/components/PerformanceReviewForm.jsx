import React from "react";
import { useFormContext } from "react-hook-form";
import {
  performanceFactors,
  otherAspects,
} from "../../../constants/performanceData";
import { Upload, Trash2, PenTool } from "lucide-react";

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

export const getCurrentFinancialYear = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`
}


const PerformanceReviewForm = ({ onSubmit }) => {
 const {
     register,
     control,
     watch,
     setValue,
         handleSubmit, // ✅ Add this

     formState: { errors },
   } = useFormContext();
    
    const signatureFile = watch("officerSignature");
    
      const { url: signatureUrl } = useObjectUrl(signatureFile);
    const currentFinancialYear = getCurrentFinancialYear();
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[1440px]"
    >
      <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">

        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Performance Appraisal Management
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Performance Review
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Evaluate employee performance, aptitude, potential, general
                  attributes, and reporting-officer details.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Financial Year
                </p>

                <p className="mt-1 text-base font-bold">
                  {currentFinancialYear}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Performance Appraisal</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Performance Review
            </span>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-bold text-slate-900">
            Reporting Officer Assessment
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Enter scores and complete all required review sections.
          </p>
        </div>
<div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
  <div className="grid gap-5 md:grid-cols-2">
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Current Financial Year
      </label>

      <input
        type="text"
        value={currentFinancialYear}
        readOnly
        className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed"
      />

      {/* Agar submit bhi karna hai */}
      <input
        type="hidden"
        value={currentFinancialYear}
        {...register("financialYear")}
      />
    </div>
  </div>
</div>
        <div className="m-4 overflow-x-auto rounded-lg border border-slate-200 sm:m-6">

          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#0b3a6f]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Performance Factor
                </th>

                <th className="w-28 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Weightage
                </th>

                <th className="w-52 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Reporting Officer Score
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {performanceFactors.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {index + 1}. {item.label}
                    </div>

                    {item.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {item.weightage}
                    </span>
                  </td>
 
                  <td className="px-4 py-3">

                    <input
                      type="number"
                      min={1}
                      max={10}
                      step="0.01"
                      placeholder="1 - 10"
                      {...register(
                        `performanceFactors.${index}.reportingOfficer`,
                        {
                          required: "Required",
                          valueAsNumber: true,
                          min: 1,
                          max: 10,
                        }
                      )}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-center text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.performanceFactors?.[index]
                      ?.reportingOfficer && (
                        <p className="mt-2 text-xs text-red-500">
                          {
                            errors.performanceFactors[index]
                              .reportingOfficer.message
                          }
                        </p>
                      )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-[#0b3a6f]">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                    Other Aspect
                  </th>

                  <th className="w-28 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                    Weightage
                  </th>

                  <th className="w-52 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                    Reporting Officer Score
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">

                {otherAspects.map((item, index) => (

                  <tr key={index} className="hover:bg-slate-50">

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {index + 1}. {item.label}
                      </div>

                      {item.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </td>

                    <td className="px-4 py-3 text-center">

                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                        {item.weightage}
                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="number"
                        min={1}
                        max={10}
                        step="0.01"
                        placeholder="1 - 10"
                        {...register(
                          `otherAspects.${index}.reportingOfficer`,
                          {
                            required: "Required",
                            valueAsNumber: true,
                            min: 1,
                            max: 10,
                          }
                        )}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-center text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                      />

                      {errors.otherAspects?.[index]
                        ?.reportingOfficer && (
                          <p className="mt-2 text-xs text-red-500">
                            {
                              errors.otherAspects[index]
                                .reportingOfficer.message
                            }
                          </p>
                        )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ================= Aptitude & Potential ================= */}

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">

            <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
              <h2 className="text-sm font-bold text-white">
                PART - III : Aptitude & Potential
              </h2>
              <p className="mt-0.5 text-xs text-blue-100">
                To be filled in by the Reporting Officer
              </p>
            </div>

            <div className="space-y-5 p-4 sm:p-5">

              {/* Career Development */}

              <div>
                <label className="mb-3 block font-semibold text-slate-700">
                  1. Career Development Field
                </label>

                <p className="mb-4 text-sm text-slate-500">
                  Please select three preferred fields (Priority 1, 2 and 3).
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm hover:border-blue-300 hover:bg-blue-50">
                    <input
                      type="checkbox"
                      value="Personnel Administration"
                      {...register("careerDevelopment")}
                    />
                    Personnel Administration
                  </label>

                  <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm hover:border-blue-300 hover:bg-blue-50">
                    <input
                      type="checkbox"
                      value="Financial Administration"
                      {...register("careerDevelopment")}
                    />
                    Financial Administration
                  </label>

                  <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm hover:border-blue-300 hover:bg-blue-50">
                    <input
                      type="checkbox"
                      value="Economic and Commercial Projects"
                      {...register("careerDevelopment")}
                    />
                    Economic & Commercial Projects
                  </label>

                  <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">

                    <label className="font-medium">
                      Any Other Field
                    </label>

                    <input
                      type="text"
                      {...register("otherCareerField")}
                      placeholder="Specify field"
                      className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>
              </div>

              {/* Training */}

              <div>

                <label className="mb-2 block font-semibold text-slate-700">
                  2. Training Recommendation
                </label>

                <textarea
                  rows={5}
                  {...register("trainingRecommendation")}
                  placeholder="Enter recommendations..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Hindi */}

              <div>

                <label className="mb-2 block font-semibold text-slate-700">
                  3. Appreciable / Praiseworthy Work in Official Language (Hindi)
                </label>

                <textarea
                  rows={5}
                  {...register("officialLanguageWork")}
                  placeholder="Enter remarks..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">

            <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
              <h2 className="text-sm font-bold text-white">
                PART - IV : General
              </h2>
            </div>

            <div className="space-y-5 p-4 sm:p-5">

              <div>
                <label className="mb-2 block font-semibold">
                  1. General State of Health
                </label>

                <textarea
                  rows={3}
                  {...register("generalHealth")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  2. Integrity
                </label>

                <select
                  {...register("integrity")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select</option>
                  <option value="Above Board">Above Board</option>
                  <option value="Questionable">Questionable</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  3. Promotion Potential
                </label>

                <textarea
                  rows={3}
                  {...register("promotionPotential")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  4. Total Marks (Out of 100)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register("totalMarks")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:w-60"
                />

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-semibold">
                    Place
                  </label>

                  <input
                    type="text"
                    {...register("place")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Date
                  </label>

                  <input
                    type="date"
                    {...register("date")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Reporting Officer Name
                  </label>

                  <input
                    type="text"
                    {...register("reportingOfficerName")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-semibold">
                    Designation
                  </label>

                  <input
                    type="text"
                    {...register("designation")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>

          </div>
{/* ================= Officer Signature ================= */}

<div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
  {/* Header */}
  <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
    <h2 className="text-sm font-bold text-white">
      Officer Signature
    </h2>

    <p className="mt-0.5 text-xs text-blue-100">
      Upload the Reporting Officer's signature.
    </p>
  </div>

  <div className="p-4 sm:p-5">

    {/* Preview Box */}
    <div className="mx-auto flex max-w-lg flex-col items-center">

      <div className="flex min-h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-500 hover:bg-blue-50">

        {signatureUrl ? (
          <img
            src={signatureUrl}
            alt="Officer Signature"
            className="max-h-28 object-contain"
          />
        ) : (
          <div className="text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <PenTool className="h-8 w-8 text-blue-600" />
            </div>

            <h4 className="font-semibold text-slate-700">
              Signature Preview
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              PNG or JPG (Transparent PNG Recommended)
            </p>

          </div>
        )}

      </div>

      {/* Hidden Upload */}
      <input
        id="signature-upload"
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setValue("officerSignature", file, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }}
      />

      {/* Buttons */}

      <div className="mt-6 flex flex-wrap justify-center gap-4">

        <label
          htmlFor="signature-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          <Upload size={18} />

          {signatureUrl
            ? "Change Signature"
            : "Upload Signature"}

        </label>

        {signatureUrl && (
          <button
            type="button"
            onClick={() =>
              setValue("officerSignature", null, {
                shouldDirty: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={18} />
            Remove
          </button>
        )}

      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        Please upload a clear signature image.
        <br />
        Maximum file size: <b>2 MB</b>.
        Preferred format: <b>Transparent PNG</b>.
      </p>

    </div>

  </div>
</div>  

          {/* Button */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-blue-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 sm:w-auto"
            >
              Submit Performance Review
            </button>
          </div>

        </div>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Reporting Officer Review • Performance Appraisal Management System
        </footer>
      </div>
    </div>
    </div>
    </form>
  );
};

export default PerformanceReviewForm;