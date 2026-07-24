"use client";

import { useFormContext, useFieldArray } from "react-hook-form";

import { useAssessmentLogic } from "./useAssessmentLogic";

export default function AssessmentForm() {
  // =========================
  // FORM
  // =========================
  const { register, control } = useFormContext();

  // =========================
  // FIELD ARRAY
  // =========================
  const { fields, append, remove } = useFieldArray({
    control,
    name: "section6.tasks",
  });

  // =========================
  // CUSTOM HOOK
  // =========================
  const data = useAssessmentLogic(control, append, remove);

  // =========================
  // DESTRUCTURE
  // =========================
  const {
    tasks: normalizedTasks,
    mou,
    romanNumbers,
    totalWeightage,
    totalReportingWeighted,
    mouReportingWeighted,
    grandWeightage,
    grandReportingWeighted,
    isValidGrandWeightage,
    isTaskWeightageValid,
    expectedTaskWeightage,
    removeTask,
    handleAddTask,
  } = data;

  // =========================
  // TOTAL REPORTING ABSOLUTE
  // =========================
  const totalReportingAbsolute = Number(
    normalizedTasks
      .reduce((sum, t) => {
        return sum + Number(t.reporting || 0);
      }, 0)
      .toFixed(2),
  );

  // =========================
  // GRAND REPORTING ABSOLUTE
  // =========================
  const grandReportingAbsolute = Number(
    (Number(mou?.reportingAbsolute || 0) + totalReportingAbsolute).toFixed(2),
  );

  const inputClass =
    "min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0b4a7f] focus:ring-2 focus:ring-blue-100";

  const readOnlyClass =
    "min-h-10 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-800 outline-none";

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto w-full max-w-[1500px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-[#083a64] to-[#0b4a7f] px-5 py-5 text-white sm:px-7 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg font-extrabold shadow-sm">
                06
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                  Annual Performance Appraisal Report
                </p>

                <h1 className="mt-1 text-xl font-extrabold leading-tight sm:text-2xl">
                  Assessment Against Assigned Targets
                </h1>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-100">
                  Record the achievement grade for MOU targets and other key
                  assigned tasks. Grade should be assigned on a scale of 1–10
                  with a maximum of two decimal places.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide">
                Section 6
              </span>

              <span
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  isValidGrandWeightage && isTaskWeightageValid
                    ? "border-emerald-200/40 bg-emerald-400/15 text-emerald-50"
                    : "border-amber-200/40 bg-amber-400/15 text-amber-50"
                }`}
              >
                {isValidGrandWeightage && isTaskWeightageValid
                  ? "Weightage Valid"
                  : "Review Required"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <SummaryCard label="MOU Weightage" value={mou?.weightage || 0} />
            <SummaryCard label="Task Weightage" value={totalWeightage || 0} />
            <SummaryCard label="Grand Weightage" value={grandWeightage || 0} />
            <SummaryCard
              label="Weighted Grade"
              value={grandReportingWeighted || 0}
            />
            <SummaryCard label="Total Tasks" value={fields.length} />
          </div>

          {/* VALIDATION */}
          {(!isValidGrandWeightage ||
            (!isTaskWeightageValid && Number(mou?.weightage || 0) > 0)) && (
            <div className="space-y-3">
              {!isValidGrandWeightage && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-extrabold text-red-700">
                    !
                  </span>
                  <div>
                    <p className="text-sm font-bold text-red-800">
                      Invalid Grand Weightage
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-red-700">
                      Grand total weightage must be 75.
                    </p>
                  </div>
                </div>
              )}

              {!isTaskWeightageValid && Number(mou?.weightage || 0) > 0 && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-extrabold text-red-700">
                    !
                  </span>
                  <div>
                    <p className="text-sm font-bold text-red-800">
                      Task Weightage Mismatch
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-red-700">
                      Task weightage should be {expectedTaskWeightage} when MOU
                      weightage is {mou?.weightage}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOLBAR */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b4a7f]">
                Assessment Entries
              </p>
              <h2 className="mt-1 text-base font-bold text-slate-900">
                MOU and Key Assigned Tasks
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                A maximum of 10 task records can be added.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTask}
              disabled={fields.length >= 10}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0b4a7f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#083a64] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add Task
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-sm">
                <thead className="bg-[#0b4a7f] text-white">
                  <tr>
                    <th className="w-[34%] border-r border-white/15 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                      Particulars
                    </th>
                    <th className="w-[14%] border-r border-white/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                      Weightage (a)
                    </th>
                    <th className="w-[18%] border-r border-white/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                      Reporting Absolute Grade (b)
                    </th>
                    <th className="w-[14%] border-r border-white/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                      Weighted Grade
                    </th>
                    <th className="w-[10%] border-r border-white/15 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                      Initials
                    </th>
                    <th className="w-[10%] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {/* MOU HEADING */}
                  <tr className="bg-blue-50">
                    <td className="border-r border-slate-200 px-4 py-3 font-bold text-[#0b4a7f]">
                      1 – MOU Targets
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      (a)
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      (b)
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      (c) = (a × b) / 100
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>

                  {/* MOU INPUT */}
                  <tr className="bg-white">
                    <td className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-800">
                      I – MOU Targets
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3">
                      <input
                        type="number"
                        step="0.01"
                        {...register("section6.mou.weightage", {
                          valueAsNumber: true,
                        })}
                        className={`${inputClass} text-center`}
                        placeholder="25 / 20 / 15"
                      />
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3">
                      <input
                        type="number"
                        step="0.01"
                        {...register("section6.mou.reportingAbsolute", {
                          valueAsNumber: true,
                        })}
                        className={`${inputClass} text-center`}
                        placeholder="0 - 100"
                      />
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3">
                      <input
                        type="text"
                        value={mouReportingWeighted || ""}
                        readOnly
                        className={readOnlyClass}
                      />
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3">
                      <input
                        type="text"
                        {...register("section6.mou.initials")}
                        className={`${inputClass} text-center`}
                        placeholder="Initials"
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-slate-400">
                      Fixed
                    </td>
                  </tr>

                  {/* TASK HEADING */}
                  <tr className="bg-slate-100">
                    <td className="border-r border-slate-200 px-4 py-3 font-bold text-slate-800">
                      II – Other Key Assigned Tasks
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      Weightage
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      (b)
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">
                      (a × b) / 10
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>

                  {fields.map((field, index) => {
                    const reportingWeighted =
                      normalizedTasks?.[index]?.reportingWeighted || "";

                    return (
                      <tr
                        key={field.id}
                        className="bg-white transition hover:bg-slate-50"
                      >
                        <td className="border-r border-slate-200 px-4 py-3">
                          <div className="flex items-start gap-3">
                            <span className="mt-1 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 px-2 text-xs font-extrabold text-[#0b4a7f]">
                              {romanNumbers[index] || `${index + 1})`}
                            </span>

                            <input
                              type="text"
                              {...register(
                                `section6.tasks.${index}.taskName`,
                              )}
                              className={inputClass}
                              placeholder="Enter task"
                            />
                          </div>
                        </td>

                        <td className="border-r border-slate-200 px-3 py-3">
                          <input
                            type="number"
                            step="0.01"
                            {...register(
                              `section6.tasks.${index}.weightage`,
                              {
                                valueAsNumber: true,
                              },
                            )}
                            className={`${inputClass} text-center`}
                            placeholder="5 / 5.5 / 6"
                          />
                        </td>

                        <td className="border-r border-slate-200 px-3 py-3">
                          <input
                            type="number"
                            step="0.01"
                            {...register(
                              `section6.tasks.${index}.reportingAbsolute`,
                              {
                                valueAsNumber: true,
                              },
                            )}
                            className={`${inputClass} text-center`}
                            placeholder="1 - 10"
                          />
                        </td>

                        <td className="border-r border-slate-200 px-3 py-3">
                          <input
                            type="text"
                            value={reportingWeighted}
                            readOnly
                            className={readOnlyClass}
                          />
                        </td>

                        <td className="border-r border-slate-200 px-3 py-3">
                          <input
                            type="text"
                            {...register(
                              `section6.tasks.${index}.initials`,
                            )}
                            className={`${inputClass} text-center`}
                            placeholder="Initials"
                          />
                        </td>

                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeTask(index)}
                            className="inline-flex min-h-9 items-center justify-center rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* TOTAL */}
                  <tr className="bg-slate-100">
                    <td className="border-r border-slate-300 px-4 py-4 font-bold text-slate-900">
                      Total ({fields.length} Tasks)
                    </td>
                    <td className="border-r border-slate-300 px-3 py-3">
                      <input
                        type="text"
                        value={totalWeightage || ""}
                        readOnly
                        className={readOnlyClass}
                      />
                    </td>
                    <td className="border-r border-slate-300 px-3 py-3">
                      <input
                        type="text"
                        value={totalReportingAbsolute || ""}
                        readOnly
                        className={readOnlyClass}
                      />
                    </td>
                    <td className="border-r border-slate-300 px-3 py-3">
                      <input
                        type="text"
                        value={totalReportingWeighted || ""}
                        readOnly
                        className={readOnlyClass}
                      />
                    </td>
                    <td className="border-r border-slate-300 px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>

                  {/* GRAND TOTAL */}
                  <tr className="bg-[#eaf3fb]">
                    <td className="border-r border-blue-200 px-4 py-4 font-extrabold text-[#083a64]">
                      III – Grand Total I & II
                    </td>
                    <td className="border-r border-blue-200 px-3 py-3">
                      <input
                        type="text"
                        value={grandWeightage || ""}
                        readOnly
                        className="min-h-10 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-[#083a64] outline-none"
                      />
                    </td>
                    <td className="border-r border-blue-200 px-3 py-3">
                      <input
                        type="text"
                        value={grandReportingAbsolute || ""}
                        readOnly
                        className="min-h-10 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-[#083a64] outline-none"
                      />
                    </td>
                    <td className="border-r border-blue-200 px-3 py-3">
                      <input
                        type="text"
                        value={grandReportingWeighted || ""}
                        readOnly
                        className="min-h-10 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-[#083a64] outline-none"
                      />
                    </td>
                    <td className="border-r border-blue-200 px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div className="flex flex-col gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-900 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Enter grades carefully and verify all calculated totals before
              submitting the appraisal form.
            </span>
            <span className="shrink-0 font-bold text-[#0b4a7f]">
              React Hook Form Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}