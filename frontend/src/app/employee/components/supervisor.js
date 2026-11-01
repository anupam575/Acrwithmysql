import React from "react";
import {
  useFormContext,
  useWatch,
} from "react-hook-form";

// 🔧 Backend base URL (hardcoded, no env variable used)
const BACKEND_URL = "http://localhost:4000";

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

    // Backend object -> { url: "/uploads/xxx.jpeg", public_id, originalName, mimeType, size }
    if (
      typeof file === "object" &&
      !(file instanceof File) &&
      !(file instanceof Blob)
    ) {
      const rawUrl = file?.url || null;

      if (rawUrl) {
        // Agar backend already full URL de raha hai to wahi use karo,
        // warna hardcoded backend URL ke saath prefix laga do
        const fullUrl = rawUrl.startsWith("http")
          ? rawUrl
          : `${BACKEND_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
        setUrl(fullUrl);
      } else {
        setUrl(null);
      }

      setType(file?.mimeType || null);
      return;
    }

    // String URL (relative path bhi ho sakta hai)
    if (typeof file === "string") {
      const fullUrl = file.startsWith("http")
        ? file
        : `${BACKEND_URL}${file.startsWith("/") ? "" : "/"}${file}`;
      setUrl(fullUrl);
      setType(null);
      return;
    }

    // File / Blob (newly selected file, not yet uploaded)
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

function Supervisor() {
const {
  register,
  formState,
  setValue,
  control,
} = useFormContext();
const signatureFile = useWatch({
  control,
  name: "officerSignature",
});

const { url: signatureUrl } =
  useObjectUrl(signatureFile);
  const getFinancialYears = () => {

  const currentYear =
    new Date().getFullYear();

  let years = [];

  for (let i = 0; i < 5; i++) {

    years.push(
      `${currentYear - i}-${currentYear - i + 1}`
    );

  }

  return years;

};
  const inputStyle =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100";

  const textareaStyle =
    "w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100";

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1320px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">Performance Appraisal Report</p>
                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">Part – II: Self Appraisal</h1>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">To be completed by the employee reported upon.</p>
              </div>
              <div className="shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">Employee Section</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span><span aria-hidden="true">/</span><span>PAR Management</span><span aria-hidden="true">/</span><span className="font-semibold text-blue-800">Self Appraisal</span>
          </div>
        </header>
        <main className="space-y-4 bg-slate-50 p-3 sm:space-y-5 sm:p-5 lg:p-7">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
              <div><h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">Reporting Period</h2><p className="mt-1 text-xs leading-5 text-slate-500">Select the financial year applicable to this appraisal.</p></div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">Financial Year</label>
                <select {...register("financialYear")} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
                  {getFinancialYears().map((year) => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
            </div>
          </section>
          {/* Section 3 */}
          <section className="rounded-lg border border-blue-200 bg-blue-50/70 p-4 sm:p-5">
  <div className="mb-3 flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white">i</span><h2 className="text-sm font-bold text-blue-950">Instructions / निर्देश</h2></div>
  <p className="text-sm leading-6 text-slate-700">
    <strong>Brief description of duties:</strong> Please specify the
    quantitative / physical / financial targets or objectives that were set
    for you in respect of eight to ten items of work, in order of priority,
    and your achievement against each target.
    <br />
    <br />
    <strong>कर्तव्यों का संक्षिप्त विवरण:</strong> कृपया अपने लिए निर्धारित
    आठ से दस कार्यों के संबंध में प्राथमिकता के क्रम में मात्रात्मक /
    भौतिक / वित्तीय लक्ष्य अथवा उद्देश्यों का उल्लेख करें तथा प्रत्येक
    लक्ष्य के विरुद्ध अपनी उपलब्धियों का विवरण दें।
  </p>
</section>

{/* PART-II Main Assessment */}
<section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
  <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
    <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />
    <h3 className="text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
      1. Tasks / Objectives & Fulfillment of Tasks / Achievements
      <br />
      1. कार्य / उद्देश्य एवं कार्यों की पूर्ति / उपलब्धियाँ
    </h3>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2">
    {/* Tasks */}
    <div className="border-b border-slate-200 p-4 sm:p-5 lg:border-b-0 lg:border-r">
      <label className="mb-3 block text-sm font-semibold text-slate-700">
        Tasks / Objectives
        <br />
        कार्य / उद्देश्य
      </label>

      <textarea
        {...register("tasks")}
        rows={10}
        className={textareaStyle}
        placeholder="Specify targets, objectives, duties and priorities... / लक्ष्य, उद्देश्य, कर्तव्य एवं प्राथमिकताओं का उल्लेख करें..."
      />
    </div>

    {/* Achievements */}
    <div className="p-4 sm:p-5">
      <label className="mb-3 block text-sm font-semibold text-slate-700">
        Fulfillment of Tasks / Achievements
        <br />
        कार्यों की पूर्ति / उपलब्धियाँ
      </label>

      <textarea
        {...register("achievements")}
        rows={10}
        className={textareaStyle}
        placeholder="Describe achievements against each target... / प्रत्येक लक्ष्य के विरुद्ध अपनी उपलब्धियों का विवरण दें..."
      />
    </div>
  </div>
</section>
        <section className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 shadow-sm sm:p-5">
  <h3 className="mb-3 text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
    2(a) Shortfalls & Suggestions
    <br />
    2(क) कमियाँ एवं सुझाव
  </h3>

  <p className="mb-4 text-sm leading-6 text-slate-600">
    Please state briefly the shortfalls with reference to the
    targets/objectives referred to above. Specify constraints, if any, in
    achieving the targets and your suggestions for improvement.
    <br />
    <br />
    कृपया उपर्युक्त लक्ष्यों/उद्देश्यों के संदर्भ में कमियों का संक्षिप्त
    विवरण दें। यदि लक्ष्यों की प्राप्ति में कोई बाधाएँ (Constraints) रही हों,
    तो उनका उल्लेख करें तथा सुधार के लिए अपने सुझाव दें।
  </p>

  <textarea
    {...register("shortfalls")}
    rows={5}
    className={textareaStyle}
    placeholder="Mention constraints, challenges and suggestions... / बाधाओं, चुनौतियों एवं सुधार संबंधी सुझावों का उल्लेख करें..."
  />
</section>

{/* Section 4 */}
<section className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm sm:p-5">
  <h3 className="mb-3 text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
    2(b) Higher Achievements & Contribution
    <br />
    2(ख) उच्च उपलब्धियाँ एवं योगदान
  </h3>

  <p className="mb-4 text-sm leading-6 text-slate-600">
    Please indicate items in which there have been significantly higher
    achievements and your contribution thereto.
    <br />
    <br />
    कृपया उन कार्यों/मदों का उल्लेख करें जिनमें उल्लेखनीय रूप से उच्च
    उपलब्धियाँ प्राप्त हुई हैं तथा उनमें आपके योगदान का विवरण दें।
  </p>

  <textarea
    {...register("higherAchievements")}
    rows={5}
    className={textareaStyle}
    placeholder="Describe exceptional achievements and contribution... / अपनी उल्लेखनीय उपलब्धियों एवं योगदान का विवरण दें..."
  />
</section>

          {/* Employee Declaration */}
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
              <h3 className="text-sm font-bold text-slate-900 sm:text-[15px]">
                Employee Declaration
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Verify the information provided above and submit the
                self-appraisal.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                  Place
                </label>
                <input
                  {...register("place")}
                  className={inputStyle}
                  placeholder="Enter place"
                />
              </div>


              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                  Name
                </label>
                <input
                  {...register("name")}
                  className={inputStyle}
                  placeholder=" Name"
                />
              </div>

              <div></div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                  Designation
                </label>
                <input
                  {...register("designation")}
                  className={inputStyle}
                  placeholder="Designation"
                />

                <p className="mt-2 text-xs italic text-slate-500">
                  (During the period of report)
                </p>
              </div>
            </div>
          </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT: UPLOAD */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="block text-[13px] font-semibold text-slate-700">
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
            <div className="flex h-20 w-36 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-[10px] text-gray-400 text-center px-2">
                  No Signature
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs font-medium text-slate-500">Preview</p>
          </div>
        </div>
            </section>

          {/* Submit */}
          <div className="sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <p className="mb-3 text-xs leading-5 text-slate-500 sm:mb-0">Please review the self-appraisal information before final submission.</p>
            <button type="submit" className="h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 sm:w-auto sm:min-w-40">Submit</button>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:px-6 sm:text-xs">Official Performance Appraisal Record • Employee Self-Appraisal Section</footer>
      </div>
    </div>
  );
}

export default Supervisor;
