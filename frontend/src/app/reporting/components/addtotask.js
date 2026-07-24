"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import {
  clampGrade,
  calcWeighted,
  calcTotal,
  calcAverage,
  calcGrandTotal,
} from "./assessmentCalc";

export default function AssessmentForm() {
  const { register, control } = useFormContext();

  const { fields, append } = useFieldArray({
    control,
    name: "section6.tasks",
  });

  // =====================================================
  // WATCH
  // =====================================================

  const tasks =
    useWatch({
      control,
      name: "section6.tasks",
    }) || [];

  const mou =
    useWatch({
      control,
      name: "section6.mou",
    }) || {};

  // =====================================================
  // ROMAN NUMBERS
  // =====================================================

  const romanNumbers = [
    "i)",
    "ii)",
    "iii)",
    "iv)",
    "v)",
    "vi)",
    "vii)",
    "viii)",
    "ix)",
    "x)",
  ];

  // =====================================================
  // TASK TOTALS
  // =====================================================

  const totalWeightage = calcTotal(
    tasks.map((task) => Number(task?.weightage || 0))
  );

  // =====================================================
  // ABSOLUTE AVERAGES
  // =====================================================

  const reportingAbsoluteArray = tasks
    .filter((task) => task?.reportingAbsolute)
    .map((task) =>
      clampGrade(Number(task?.reportingAbsolute || 0))
    );

  const reviewingAbsoluteArray = tasks
    .filter((task) => task?.reviewingAbsolute)
    .map((task) =>
      clampGrade(Number(task?.reviewingAbsolute || 0))
    );

  const totalReportingAbsolute =
    reportingAbsoluteArray.length > 0
      ? calcAverage(reportingAbsoluteArray)
      : "";

  const totalReviewingAbsolute =
    reviewingAbsoluteArray.length > 0
      ? calcAverage(reviewingAbsoluteArray)
      : "";

  // =====================================================
  // TASK WEIGHTED TOTALS
  // =====================================================

  const totalReportingWeighted = calcTotal(
    tasks.map((task) =>
      task?.weightage && task?.reportingAbsolute
        ? calcWeighted(
          Number(task?.weightage),
          clampGrade(
            Number(task?.reportingAbsolute)
          ),
          10
        )
        : 0
    )
  );

  const totalReviewingWeighted = calcTotal(
    tasks.map((task) =>
      task?.weightage && task?.reviewingAbsolute
        ? calcWeighted(
          Number(task?.weightage),
          clampGrade(
            Number(task?.reviewingAbsolute)
          ),
          10
        )
        : 0
    )
  );


  const mouReportingWeighted =
    mou?.weightage && mou?.reportingAbsolute
      ? calcWeighted(
        Number(mou?.weightage),
        clampGrade(
          Number(mou?.reportingAbsolute)
        ),
        100
      )
      : "";

  const mouReviewingWeighted =
    mou?.weightage && mou?.reviewingAbsolute
      ? calcWeighted(
        Number(mou?.weightage),
        clampGrade(
          Number(mou?.reviewingAbsolute)
        ),
        100
      )
      : "";

  // =====================================================
  // GRAND WEIGHTAGE
  // =====================================================

  const grandWeightage = calcGrandTotal(
    Number(mou?.weightage || 0),
    Number(totalWeightage || 0)
  );

  // =====================================================
  // GRAND ABSOLUTE
  // WEIGHTED AVERAGE OF MOU + TASKS
  // =====================================================

  const grandReportingAbsolute =
    mou?.reportingAbsolute ||
      totalReportingAbsolute
      ? calcAverage([
        Number(mou?.reportingAbsolute || 0),
        Number(totalReportingAbsolute || 0),
      ])
      : "";

  const grandReviewingAbsolute =
    mou?.reviewingAbsolute ||
      totalReviewingAbsolute
      ? calcAverage([
        Number(mou?.reviewingAbsolute || 0),
        Number(totalReviewingAbsolute || 0),
      ])
      : "";

  // =====================================================
  // GRAND WEIGHTED TOTALS
  // =====================================================

  const grandReportingWeighted =
    mouReportingWeighted ||
      totalReportingWeighted
      ? calcGrandTotal(
        Number(mouReportingWeighted || 0),
        Number(totalReportingWeighted || 0)
      )
      : "";

  const grandReviewingWeighted =
    mouReviewingWeighted ||
      totalReviewingWeighted
      ? calcGrandTotal(
        Number(mouReviewingWeighted || 0),
        Number(totalReviewingWeighted || 0)
      )
      : "";

  // =====================================================
  // VALIDATIONS
  // =====================================================

  const isValidGrandWeightage =
    Number(grandWeightage) === 75;

  // =====================================================
  // EXPECTED TASK WEIGHTAGE
  // =====================================================

  let expectedTaskWeightage = 0;

  if (Number(mou?.weightage) === 25) {
    expectedTaskWeightage = 50;
  }

  if (Number(mou?.weightage) === 20) {
    expectedTaskWeightage = 55;
  }

  if (Number(mou?.weightage) === 15) {
    expectedTaskWeightage = 60;
  }

  const isTaskWeightageValid =
    Number(totalWeightage) ===
    expectedTaskWeightage;

  // =====================================================
  // ADD TASK
  // =====================================================

  const handleAddTask = () => {
    if (fields.length >= 10) return;

    append({
      taskName: "",
      weightage: "",
      reportingAbsolute: "",
      reviewingAbsolute: "",
      initials: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">

      <div className="bg-white w-full max-w-6xl border border-gray-400 p-8 shadow-md">

        {/* ===================================================== */}
        {/* HEADING */}
        {/* ===================================================== */}

        <div className="flex gap-4 mb-6 text-[15px] leading-6">

          <span className="font-medium">
            6.
          </span>

          <div>
            <p>
              <span className="font-semibold">
                Assessment of the achievements
                made against the targets.
              </span>{" "}

              <span className="italic text-[13px]">
                Grade should be assigned on a
                scale of 1–10 with maximum
                2 decimal numbers.
              </span>
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* VALIDATIONS */}
        {/* ===================================================== */}

        <div className="mb-4 space-y-2">

          {!isValidGrandWeightage && (
            <div className="text-red-600 text-sm font-medium">
              Grand total weightage must be 75.
            </div>
          )}

          {!isTaskWeightageValid &&
            Number(mou?.weightage || 0) > 0 && (
              <div className="text-red-600 text-sm font-medium">
                Task weightage should be{" "}
                {expectedTaskWeightage} when
                MOU weightage is{" "}
                {mou?.weightage}.
              </div>
            )}
        </div>

        {/* ===================================================== */}
        {/* ADD TASK */}
        {/* ===================================================== */}

        <div className="flex justify-end mb-4">

          <button
            type="button"
            onClick={handleAddTask}
            disabled={fields.length >= 10}
            className="border border-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            + Add Task
          </button>
        </div>

        {/* ===================================================== */}
        {/* TABLE */}
        {/* ===================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full border-collapse border border-black text-sm">

            {/* ===================================================== */}
            {/* TABLE HEAD */}
            {/* ===================================================== */}

            <thead>

              <tr>

                <th className="border border-black p-2">
                  Particulars
                </th>

                <th className="border border-black p-2">
                  Weightage
                </th>

                <th
                  className="border border-black p-2 text-center"
                  colSpan={2}
                >
                  Reporting Authority
                </th>

                <th
                  className="border border-black p-2 text-center"
                  colSpan={2}
                >
                  Reviewing Authority
                </th>

                <th
                  className="border border-black p-2"
                  rowSpan={2}
                >
                  Initials
                </th>
              </tr>

              <tr>

                <th className="border border-black p-2"></th>

                <th className="border border-black p-2">
                  (a)
                </th>

                <th className="border border-black p-2">
                  Absolute Grade
                </th>

                <th className="border border-black p-2">
                  Weighted Grade
                </th>

                <th className="border border-black p-2">
                  Absolute Grade
                </th>

                <th className="border border-black p-2">
                  Weighted Grade
                </th>
              </tr>
            </thead>

            {/* ===================================================== */}
            {/* TABLE BODY */}
            {/* ===================================================== */}

            <tbody>

              {/* ===================================================== */}
              {/* MOU */}
              {/* ===================================================== */}

              <tr>

                <td className="border border-black p-2 font-medium">
                  I – MOU Targets
                </td>

                <td className="border border-black p-2">

                  <input
                    type="number"
                    step="0.01"
                    {...register(
                      "section6.mou.weightage"
                    )}
                    className="w-full outline-none text-center"
                    placeholder="25 / 20 / 15"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="number"
                    step="0.01"
                    {...register(
                      "section6.mou.reportingAbsolute"
                    )}
                    className="w-full outline-none text-center"
                    placeholder="1 - 10"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={mouReportingWeighted}
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="number"
                    step="0.01"
                    {...register(
                      "section6.mou.reviewingAbsolute"
                    )}
                    className="w-full outline-none text-center"
                    placeholder="1 - 10"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={mouReviewingWeighted}
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    {...register(
                      "section6.mou.initials"
                    )}
                    className="w-full outline-none text-center"
                    placeholder="Initials"
                  />
                </td>
              </tr>

              {/* ===================================================== */}
              {/* SECTION HEADER */}
              {/* ===================================================== */}

              <tr>

                <td className="border border-black p-2 font-semibold">
                  II – Other Key Assigned Tasks
                </td>

                <td className="border border-black p-2 text-center">
                  Weightage
                </td>

                <td className="border border-black p-2 text-center">
                  (b)
                </td>

                <td className="border border-black p-2 text-center">
                  (a × b) / 10
                </td>

                <td className="border border-black p-2 text-center">
                  (d)
                </td>

                <td className="border border-black p-2 text-center">
                  (a × d) / 10
                </td>

                <td className="border border-black p-2"></td>
              </tr>

              {/* ===================================================== */}
              {/* TASK ROWS */}
              {/* ===================================================== */}

              {fields.map((field, index) => {

                const reportingWeighted =
                  tasks?.[index]?.weightage &&
                    tasks?.[index]
                      ?.reportingAbsolute
                    ? calcWeighted(
                      Number(
                        tasks?.[index]
                          ?.weightage
                      ),
                      clampGrade(
                        Number(
                          tasks?.[index]
                            ?.reportingAbsolute
                        )
                      ),
                      10
                    )
                    : "";

                const reviewingWeighted =
                  tasks?.[index]?.weightage &&
                    tasks?.[index]
                      ?.reviewingAbsolute
                    ? calcWeighted(
                      Number(
                        tasks?.[index]
                          ?.weightage
                      ),
                      clampGrade(
                        Number(
                          tasks?.[index]
                            ?.reviewingAbsolute
                        )
                      ),
                      10
                    )
                    : "";

                return (
                  <tr key={field.id}>

                    <td className="border border-black p-2">

                      <div className="flex flex-col gap-2">

                        <span>
                          {romanNumbers[index] ||
                            `${index + 1})`}
                        </span>

                        <input
                          type="text"
                          {...register(
                            `section6.tasks.${index}.taskName`
                          )}
                          className="w-full outline-none px-2 py-1"
                          placeholder="Enter task"
                        />
                      </div>
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="number"
                        step="0.01"
                        {...register(
                          `section6.tasks.${index}.weightage`
                        )}
                        className="w-full outline-none text-center"
                        placeholder="5 / 5.5 / 6"
                      />
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="number"
                        step="0.01"
                        {...register(
                          `section6.tasks.${index}.reportingAbsolute`
                        )}
                        className="w-full outline-none text-center"
                        placeholder="1 - 10"
                      />
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="text"
                        value={reportingWeighted}
                        readOnly
                        className="w-full bg-gray-50 outline-none text-center"
                      />
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="number"
                        step="0.01"
                        {...register(
                          `section6.tasks.${index}.reviewingAbsolute`
                        )}
                        className="w-full outline-none text-center"
                        placeholder="1 - 10"
                      />
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="text"
                        value={reviewingWeighted}
                        readOnly
                        className="w-full bg-gray-50 outline-none text-center"
                      />
                    </td>

                    <td className="border border-black p-2">

                      <input
                        type="text"
                        {...register(
                          `section6.tasks.${index}.initials`
                        )}
                        className="w-full outline-none text-center"
                        placeholder="Initials"
                      />
                    </td>
                  </tr>
                );
              })}

              {/* ===================================================== */}
              {/* TOTAL */}
              {/* ===================================================== */}

              <tr>

                <td className="border border-black p-2 font-semibold">
                  Total ({fields.length} Tasks)
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={totalWeightage || ""}
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      totalReportingAbsolute || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      totalReportingWeighted || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      totalReviewingAbsolute || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      totalReviewingWeighted || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2"></td>
              </tr>

              {/* ===================================================== */}
              {/* GRAND TOTAL */}
              {/* ===================================================== */}

              <tr>

                <td className="border border-black p-2 font-semibold">
                  III – Grand Total I & II
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={grandWeightage || ""}
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      grandReportingAbsolute || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      grandReportingWeighted || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      grandReviewingAbsolute || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2">

                  <input
                    type="text"
                    value={
                      grandReviewingWeighted || ""
                    }
                    readOnly
                    className="w-full bg-gray-50 outline-none text-center"
                  />
                </td>

                <td className="border border-black p-2"></td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}