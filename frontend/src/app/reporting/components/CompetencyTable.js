"use client";

import { useFormContext, useWatch } from "react-hook-form";

const rows = [
  "Effective communication skills",
  "Strategic orientation and Decision making ability",
  "Problem solving and Analytical ability",
  "Ability to develop and motivate team members",
  "Ability to coordinate and develop collaborative partnerships",
  "Innovation and change orientation",
  "Planning and Organizing",
  "Result orientation",
  "Business Acumen",
  "Role based functional competency",
];

const roman = [
  "i.",
  "ii.",
  "iii.",
  "iv.(b)",
  "v.(b)",
  "vi.",
  "vii.",
  "viii.",
  "ix.",
  "x.",
];

const inputClass =
  "w-full min-w-[90px] rounded-md border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0b4a7f] focus:ring-2 focus:ring-blue-100";

const Section7CompetencyTable = () => {
  const { register, control } = useFormContext();

  const data = useWatch({
    control,
    name: "section7",
  });

  // TOTAL
  const total = (data || []).reduce((sum, item) => {
    const val = parseFloat(item?.reportingAuthority || 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  // OVERALL
  const overall = (total / 4).toFixed(2);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0b4a7f] text-sm font-extrabold text-white">
              7
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                Annual Performance Appraisal Report
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Assessment of Functional Competencies
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Enter the Reporting Authority grade for each competency on a
                scale of 1 to 10.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0b4a7f]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#0b4a7f]">
              Section 7
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:grid-cols-3 sm:px-6">
        <SummaryCard
          label="Total Competencies"
          value={rows.length}
          helper="Competency parameters"
        />

        <SummaryCard
          label="Total Score"
          value={total.toFixed(2)}
          helper="Reporting Authority total"
        />

        <SummaryCard
          label="Overall Grade"
          value={overall}
          helper="Calculated as Total / 4"
          highlight
        />
      </div>

      {/* INFORMATION */}
      <div className="px-5 pt-5 sm:px-6">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b4a7f] text-xs font-bold text-white">
              i
            </span>

            <div>
              <p className="text-sm font-bold text-blue-950">
                Grading Instructions
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-800">
                Reporting grades must be entered between 1 and 10. Decimal
                values up to two places are supported.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead className="bg-[#0b4a7f] text-white">
                <tr>
                  <th className="w-24 border-r border-blue-800 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                    Sl. No.
                  </th>

                  <th className="border-r border-blue-800 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                    Competencies
                  </th>

                  <th className="w-40 border-r border-blue-800 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                    Reporting
                  </th>

                  <th className="w-36 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                    Initials
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={index}
                    className={`align-middle transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="border-r border-t border-slate-300 px-4 py-3">
                      <span className="inline-flex min-w-10 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-[#0b4a7f]">
                        {roman[index]}
                      </span>
                    </td>

                    <td className="border-r border-t border-slate-300 px-4 py-3">
                      <p className="font-medium leading-6 text-slate-800">
                        {item}
                      </p>
                    </td>

                    <td className="border-r border-t border-slate-300 px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max="10"
                        {...register(`section7.${index}.reportingAuthority`)}
                        className={inputClass}
                        placeholder="1 - 10"
                        aria-label={`${item} reporting authority grade`}
                      />
                    </td>

                    <td className="border-t border-slate-300 px-4 py-3">
                      <input
                        {...register(`section7.${index}.initials`)}
                        className={inputClass}
                        placeholder="Initials"
                        aria-label={`${item} initials`}
                      />
                    </td>
                  </tr>
                ))}

                {/* TOTAL */}
                <tr className="bg-slate-100">
                  <td
                    colSpan={2}
                    className="border-r border-t-2 border-slate-400 px-4 py-4"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Competency Score
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        Total (i to x)
                      </p>
                    </div>
                  </td>

                  <td className="border-r border-t-2 border-slate-400 px-4 py-4 text-center">
                    <span className="inline-flex min-w-24 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-extrabold text-slate-900">
                      {total.toFixed(2)}
                    </span>
                  </td>

                  <td className="border-t-2 border-slate-400 px-4 py-4" />
                </tr>

                {/* OVERALL */}
                <tr className="bg-blue-50">
                  <td
                    colSpan={2}
                    className="border-r border-t border-blue-200 px-4 py-4"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b4a7f]">
                        Final Competency Result
                      </p>

                      <p className="mt-1 font-extrabold text-blue-950">
                        Overall Grading (Total / 4)
                      </p>
                    </div>
                  </td>

                  <td className="border-r border-t border-blue-200 px-4 py-4 text-center">
                    <span className="inline-flex min-w-24 items-center justify-center rounded-md bg-[#0b4a7f] px-3 py-2 text-lg font-extrabold text-white shadow-sm">
                      {overall}
                    </span>
                  </td>

                  <td className="border-t border-blue-200 px-4 py-4" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          On smaller screens, scroll horizontally inside the table area to view
          all competency columns.
        </p>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Functional competency assessment
          </span>

          <span className="font-semibold text-[#0b4a7f]">
            React Hook Form Connected
          </span>
        </div>
      </div>
    </section>
  );
};

function SummaryCard({ label, value, helper, highlight = false }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
          highlight ? "text-[#0b4a7f]" : "text-slate-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-extrabold tracking-tight ${
          highlight ? "text-[#0b4a7f]" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {helper}
      </p>
    </div>
  );
}

export default Section7CompetencyTable;