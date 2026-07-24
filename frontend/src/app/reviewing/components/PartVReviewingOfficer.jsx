import React from "react";
import { useFormContext } from "react-hook-form";
import { Upload, Trash2, PenTool } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

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

const PartVReviewingOfficer = () => {
  const { register, watch, setValue } = useFormContext();

  const signatureFile = watch("officerSignature");
  const { url: signatureUrl } = useObjectUrl(signatureFile);
  const currentFinancialYear = getCurrentFinancialYear();

  return (
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
                <h1 className="mt-1 text-xl font-bold sm:text-2xl">PART - V</h1>
                <p className="mt-1 text-sm font-semibold text-blue-100 sm:text-base">
                  Remarks of the Reviewing Officer
                </p>
                <p className="mt-0.5 text-xs text-blue-200">
                  To be filled in by the Reviewing Officer
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Financial Year
                </p>
                <p className="mt-1 text-base font-bold">{currentFinancialYear}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span><span>/</span>
            <span>Performance Appraisal</span><span>/</span>
            <span className="font-semibold text-blue-800">Reviewing Officer</span>
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900">
              Reviewing Officer Assessment
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review the reporting officer assessment and complete the details below.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:col-span-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Current Financial Year
                </label>
                <input
                  type="text"
                  value={currentFinancialYear}
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700"
                />
                <input
                  type="hidden"
                  value={currentFinancialYear}
                  {...register("financialYear")}
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-8">
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  1. Assessment of Reporting Officer
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-blue-400 hover:bg-blue-50">
                    <input
                      type="radio"
                      value="Agree"
                      {...register("reviewAssessment")}
                      className="h-4 w-4 accent-blue-800"
                    />
                    <span className="text-sm font-semibold text-slate-700">I Agree</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-red-400 hover:bg-red-50">
                    <input
                      type="radio"
                      value="Disagree"
                      {...register("reviewAssessment")}
                      className="h-4 w-4 accent-red-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">I Disagree</span>
                  </label>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Assessment relates to the marks awarded in Part III-A (1 to 8)
                  and Part III-B (1 to 4).
                </p>
              </div>
            </div>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
                <h2 className="text-sm font-bold text-white">Review Remarks and Score</h2>
              </div>

              <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    2. Remarks (If Disagreed)
                  </label>
                  <textarea
                    rows={7}
                    {...register("reviewRemarks")}
                    placeholder="If not agreed, indicate the traits/performance areas where the Reporting Officer has over/under rated the assessee and specify the reasons along with revised marks."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    3. Total Score (Out of 100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    placeholder="0.00"
                    {...register("reviewTotalScore", {
                      valueAsNumber: true,
                    })}
                    className={`${inputClass} text-center text-xl font-bold`}
                  />
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
                <h2 className="text-sm font-bold text-white">Reviewing Officer Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Place</label>
                  <input type="text" placeholder="Enter Place" {...register("reviewPlace")} className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
                  <input type="date" {...register("reviewDate")} className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                  <input type="text" placeholder="Reviewing Officer Name" {...register("reviewName")} className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Designation</label>
                  <input type="text" placeholder="Designation" {...register("reviewDesignation")} className={inputClass} />
                  <p className="mt-1.5 text-xs italic text-slate-500">During the period of report</p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="bg-[#0b3a6f] px-4 py-3 sm:px-5">
                <h2 className="text-sm font-bold text-white">Officer Signature</h2>
                <p className="mt-0.5 text-xs text-blue-100">
                  Upload the Reporting Officer&apos;s signature.
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <p>
                    <b>signatureFile:</b>{" "}
                    {signatureFile
                      ? `${signatureFile.name} (${signatureFile.type})`
                      : "null"}
                  </p>
                  <p className="mt-1 break-all">
                    <b>signatureUrl:</b> {signatureUrl || "null"}
                  </p>
                </div>

                <div className="mx-auto flex max-w-lg flex-col items-center">
                  <div className="flex min-h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Officer Signature" className="max-h-28 w-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <PenTool className="h-6 w-6 text-blue-700" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-700">Signature Preview</h4>
                        <p className="mt-1 text-xs text-slate-500">PNG or JPG</p>
                      </div>
                    )}
                  </div>

                  <input
                    id="review-signature-upload"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      console.log("========== FILE INPUT ==========");

                      const file = e.target.files?.[0];

                      console.log("Selected File:", file);

                      if (!file) {
                        console.log("No file selected");
                        return;
                      }

                      setValue("officerSignature", file, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });

                      console.log("watch after setValue:", watch("officerSignature"));

                      setTimeout(() => {
                        console.log("watch after timeout:", watch("officerSignature"));
                      }, 100);
                    }}
                  />

                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <label
                      htmlFor="review-signature-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                    >
                      <Upload size={18} />
                      Upload Signature
                    </label>

                    {signatureUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Removing signature");

                          setValue("officerSignature", null);

                          console.log("After remove:", watch("officerSignature"));
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-blue-800 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-900 sm:w-auto"
            >
              Submit
            </button>
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Reviewing Officer Assessment • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
};

export default PartVReviewingOfficer;