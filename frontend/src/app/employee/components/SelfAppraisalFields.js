"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { ShieldCheck, UserCheck } from "lucide-react";
const handleBack = () => {
    setActiveForm(null);
    setSelectedCategory(null);
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


export const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
};

/* ================= SELECT ================= */

export const Select = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 ${className}`}
    >
      {children}
    </select>
  );
};

/* ================= TEXTAREA ================= */

export const TextArea = ({
  className = "",
  ...props
}) => {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  );
};

/* ================= CARD ================= */

export const Card = ({ title, children }) => {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
          <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />
          <h2 className="whitespace-pre-line text-sm font-bold leading-6 text-slate-900 sm:text-[15px]">
            {title}
          </h2>
        </div>
      )}
      <div className="space-y-5 p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function SelfAppraisalFields({
  fields,
  append,
  remove,
  isSubmitting,
  isEdit,
}) {
const {
  register,
  formState,
  setValue,
  control,
} = useFormContext();

/* Signature */
const signatureFile = useWatch({
  control,
  name: "officerSignature",
});

const { url: signatureUrl } =
  useObjectUrl(signatureFile);

/* Financial Years */
const getFinancialYears = () => {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: 5 },
    (_, i) =>
      `${currentYear - i}-${currentYear - i + 1}`
  );
};

/* Tasks */
const tasks =
  useWatch({
    control,
    name: "tasks",
  }) || [];

/* MOU Weightage */
const mouWeightage = Number(
  useWatch({
    control,
    name: "mouWeightage",
  }) || 0
);

/* Selected Task Weightage */
const selectedTaskWeightage = Number(
  useWatch({
    control,
    name: "totalTaskWeightage",
  }) || 0
);
  const totalTaskWeightage =
    tasks.reduce((sum, task) => {
      const value = parseFloat(
        task?.weightage
      );

      return (
        sum +
        (isNaN(value) ? 0 : value)
      );
    }, 0);

  const grandTotal = mouWeightage + totalTaskWeightage;

  const taskWeightageMatched =
    totalTaskWeightage ===
    selectedTaskWeightage;

  const grandTotalMatched =
    grandTotal === 75;

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">Performance Appraisal Report</p>
                <h1 className="mt-1 text-xl font-bold sm:text-2xl">Section II – Self Appraisal</h1>
                <p className="mt-1 text-xs text-blue-100 sm:text-sm">Self-appraisal of the officer reported upon.</p>
              </div>
              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold">  <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4
  rounded-xl bg-indigo-50 text-indigo-700
  border border-indigo-100
  hover:bg-indigo-100 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Back
          </button></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 bg-white px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span><span>/</span><span>PAR Management</span><span>/</span><span className="font-semibold text-blue-800">Self Appraisal</span>
          </div>
        </header>
        <main className="space-y-4 bg-slate-50 p-3 sm:space-y-5 sm:p-5 lg:p-7">

      <Card title="1. Brief Description of Responsibilities">
        <p className="text-sm text-gray-500">
          (Objectives of the position and
          responsibilities in ~3000 words)
        </p>

        <TextArea
          {...register("responsibilities")}
          placeholder="Write your responsibilities..."
          className="h-32"
        />
      </Card>

      {/* FINAL MOU SCORE */}


      {/* SECTION 2 */}

      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <h1 className="text-sm font-bold text-slate-900 sm:text-[15px]">
          Annual Work Plan & Achievement
        </h1>

        {/* MOU */}

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="font-medium">
            1 – MOU Targets
          </div>

          <Select
            {...register("mouWeightage")}
          >
            <option value="">
              Select Weightage
            </option>
            <option value="25">25</option>
            <option value="20">20</option>
            <option value="15">15</option>
          </Select>

          <Input
            placeholder="Deliverables"
            {...register(
              "mouDeliverables"
            )}
          />

          <Input
            placeholder="Achievement"
            {...register(
              "mouAchievement"
            )}
          />
        </div>

        {/* TASK WEIGHTAGE */}

        <div className="space-y-4">
          <Select
            {...register(
              "totalTaskWeightage"
            )}
          >
            <option value="">
              Select Task Weightage
            </option>
            <option value="50">50</option>
            <option value="55">55</option>
            <option value="60">60</option>
          </Select>

          {/* TASK LIST */}

          {fields.map(
            (field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-2 xl:grid-cols-[1.3fr_.65fr_1fr_1fr_auto] xl:items-center"
              >
                <Input
                  placeholder={`Task ${
                    index + 1
                  }`}
                  {...register(
                    `tasks.${index}.taskName`
                  )}
                />

                <Input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Weightage"
                  {...register(
                    `tasks.${index}.weightage`
                  )}
                />

                <Input
                  placeholder="Deliverables"
                  {...register(
                    `tasks.${index}.deliverables`
                  )}
                />

                <Input
                  placeholder="Achievement"
                  {...register(
                    `tasks.${index}.achievement`
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    remove(index)
                  }
                  className="h-10 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            )
          )}

          {/* ADD TASK */}

          {fields.length < 10 && (
            <button
              type="button"
              onClick={() =>
                append({
                  taskName: "",
                  weightage: "",
                  deliverables: "",
                  achievement: "",
                })
              }
              className="h-10 rounded-md bg-blue-800 px-4 text-sm font-bold text-white hover:bg-blue-900"
            >
              + Add Task
            </button>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">

  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">
      MOU Weightage
    </span>
    <span className="font-bold text-gray-900">
      {mouWeightage}
    </span>
  </div>

  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">
      Selected Task Weightage
    </span>
    <span className="font-bold text-gray-900">
      {selectedTaskWeightage}
    </span>
  </div>

  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">
      Total Task Weightage
    </span>
    <span className="font-bold text-gray-900">
      {totalTaskWeightage}
    </span>
  </div>

  {!taskWeightageMatched && (
    <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
      Total task weightage must equal selected weightage (
      {selectedTaskWeightage})
    </p>
  )}

  <div className="border-t border-black/10 pt-4 flex justify-between items-center">
    <span className="font-semibold text-gray-800">
      Grand Total
    </span>

    <span className="font-bold text-xl text-black">
      {grandTotal}
    </span>
  </div>

  {!grandTotalMatched && (
    <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
      Grand Total must be 75
    </p>
  )}

  {grandTotalMatched && taskWeightageMatched && (
    <p className="text-green-600 text-sm font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-200">
      ✓ Calculation matched successfully
    </p>
  )}
</div>

</div>
          

      <Card
  title={`3. During the period under report, do you believe that you have made any exceptional contribution, such as the successful completion of an extraordinarily challenging task or a major systemic improvement resulting in significant benefits to the Company/Department and/or reduction in time and costs? If yes, please provide a detailed description of your contribution (up to 3000 words).

3. रिपोर्टिंग अवधि के दौरान क्या आपको लगता है कि आपने कोई असाधारण योगदान दिया है, जैसे किसी अत्यंत चुनौतीपूर्ण कार्य को सफलतापूर्वक पूरा करना अथवा कार्य प्रणाली में कोई महत्वपूर्ण सुधार करना, जिसके परिणामस्वरूप कंपनी/विभाग को उल्लेखनीय लाभ हुआ हो या समय एवं लागत में कमी आई हो? यदि हाँ, तो कृपया अपने योगदान का विस्तृत विवरण दें (अधिकतम 3000 शब्दों तक)।`}
>
  <TextArea
    {...register("exceptionalContribution")}
    className="h-40"
    rows={12}
    maxLength={18000} // Approx. 3000 words
    placeholder="Write your exceptional contribution here (up to 3000 words) / यहाँ अपने असाधारण योगदान का विस्तृत विवरण लिखें (अधिकतम 3000 शब्दों तक)..."
  />
</Card>

      {/* ================= SECTION 4 ================= */}
<Card
  title={`4. What are the constraints that hindered your performance? Please describe the challenges, limitations, or obstacles that affected your ability to perform your duties effectively during the reporting period (up to 3000 words).

4. आपकी कार्य निष्पादन क्षमता में बाधा डालने वाले प्रमुख अवरोध (Constraints) क्या थे? कृपया उन चुनौतियों, सीमाओं अथवा परिस्थितियों का विस्तृत विवरण दें, जिन्होंने रिपोर्टिंग अवधि के दौरान आपके कार्यों का प्रभावी ढंग से निर्वहन करने में कठिनाई उत्पन्न की (अधिकतम 3000 शब्दों तक)।`}
>
  <TextArea
    {...register("constraints")}
    className="h-40"
    rows={12}
    maxLength={18000} // Approx. 3000 words
    placeholder="Describe the constraints that affected your performance (up to 3000 words) / अपने कार्य निष्पादन में आने वाली बाधाओं का विस्तृत विवरण लिखें (अधिकतम 3000 शब्दों तक)..."
  />
</Card>

      {/* ================= SECTION 5 ================= */}
<Card
  title={`5. Please indicate specific areas of training that will add value to you.

5. कृपया प्रशिक्षण के उन विशिष्ट क्षेत्रों का उल्लेख करें जो आपके लिए मूल्यवर्धक (Value Addition) होंगे।`}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      {...register("currentAssignmentTraining")}
      placeholder="Current Assignment Training / वर्तमान कार्य हेतु प्रशिक्षण"
    />

    <Input
      {...register("futureCareerTraining")}
      placeholder="Future Career Training / भविष्य के कैरियर हेतु प्रशिक्षण"
    />
  </div>
</Card>

      {/* ================= SECTION 6 ================= */}
<Card
  title={`6. Declaration

6. घोषणा`}
>
  {[
    {
      text: "Have you filed your immovable property return in the prescribed format as due? If yes, please mention the date. / क्या आपने निर्धारित प्रारूप में अपनी अचल संपत्ति का विवरण (Immovable Property Return) नियत समय पर प्रस्तुत किया है? यदि हाँ, तो कृपया तिथि का उल्लेख करें।",
      name: "immovablePropertyReturnFiled",
      date: "immovablePropertyReturnDate",
    },
    {
      text: "Have you undergone the suggested medical check up? / क्या आपने सुझाई गई चिकित्सीय जांच (Medical Check-up) कराई है?",
      name: "medicalCheckupDone",
    },
    {
      text: "Have you set the annual work plan for all officers for the current year, in respect of whom you are the Reporting Authority? / क्या आपने वर्तमान वर्ष के लिए उन सभी अधिकारियों का वार्षिक कार्य योजना (Annual Work Plan) निर्धारित की है, जिनके लिए आप प्रतिवेदन अधिकारी (Reporting Authority) हैं?",
      name: "annualWorkPlanSetForOfficers",
    },
  ].map((item, i) => (
    <div
      key={i}
      className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] md:items-center"
    >
      <p className="text-sm text-gray-600">{item.text}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select {...register(item.name)}>
          <option value="">Select / चुनें</option>

          <option value="yes">Yes / हाँ</option>

          <option value="no">No / नहीं</option>
        </Select>

        {item.date && (
          <Input
            type="date"
            {...register(item.date)}
          />
        )}
      </div>
    </div>
  ))}
</Card>

  <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
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
        file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-blue-800
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

   <select
  {...register("financialYear")}
  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
>
  {getFinancialYears().map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

      {/* SUBMIT BUTTON */}

      <div className="sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:static sm:flex sm:justify-end sm:px-5 sm:py-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-44"
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Appraisal"
            : "Create Appraisal"}
        </button>
      </div>
        </main>
        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:px-6 sm:text-xs">
          Official Performance Appraisal Record • Self-Appraisal Module
        </footer>
      </div>
    </div>
  );
}