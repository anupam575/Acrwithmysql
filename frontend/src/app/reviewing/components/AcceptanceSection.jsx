import React from "react";
import { useFormContext } from "react-hook-form";

const AcceptanceSectionForm = ({ onSubmit }) => {
  const { register } = useFormContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10"
      >
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Section V – Acceptance by the Accepting Authority
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please read the relevant instruction attached to this form before filling up this section
          </p>
        </div>

        {/* QUESTION 1 */}
        <div className="mb-6 p-6 rounded-2xl bg-gray-50">
          <label className="block text-gray-700 font-medium mb-4">
            1. Is the overall grade consistent with pen picture?
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                value="Yes"
                {...register("overallGradeConsistent")}
                className="accent-blue-600"
              />
              Yes
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                value="No"
                {...register("overallGradeConsistent")}
                className="accent-blue-600"
              />
              No
            </label>
          </div>
        </div>

        {/* QUESTION 2 */}
        <div className="mb-6 p-6 rounded-2xl bg-gray-50">
          <label className="block text-gray-700 font-medium mb-4">
            2. Do you agree with remarks?
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                value="Yes"
                {...register("agreeWithRemarks")}
                className="accent-blue-600"
              />
              Yes
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                value="No"
                {...register("agreeWithRemarks")}
                className="accent-blue-600"
              />
              No
            </label>
          </div>
        </div>

        {/* QUESTION 3 */}
        <div className="mb-6 p-6 rounded-2xl bg-gray-50">
          <label className="block text-gray-700 font-medium mb-4">
            3. Difference of opinion (if any)
          </label>

          <textarea
            rows={6}
            {...register("differenceOpinion")}
            className="w-full bg-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write details here..."
          />
        </div>

        {/* QUESTION 4 */}
        <div className="mb-6 p-6 rounded-2xl bg-gray-50">
          <label className="block text-gray-700 font-medium mb-4">
            4. Overall grade (out of 100)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("overallGrade")}
            className="w-full bg-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. 87.50"
          />
        </div>

        {/* SIGNATURE */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-gray-50">
            <label className="block text-gray-700 font-medium mb-3">
              Signature
            </label>
            <input
              type="text"
              {...register("acceptingAuthoritySignature")}
              className="w-full bg-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="p-6 rounded-2xl bg-gray-50">
            <label className="block text-gray-700 font-medium mb-3">
              Name & Designation
            </label>
            <input
              type="text"
              {...register("acceptingAuthorityNameDesignation")}
              className="w-full bg-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-10 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcceptanceSectionForm;