"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function Review({ employeeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/review/employee/${employeeId}`
        );

        setReviews(res?.data?.data || []);
      } catch (error) {
        console.error(error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [employeeId]);

  const handleViewDetails = (review) => {
    setSelectedReview((prev) =>
      prev?._id === review._id ? null : review
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-center font-medium text-slate-600">
            Loading Reviews...
          </p>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800">
            No Reviews Found
          </h2>

          <p className="mt-2 text-slate-500">
            No review records available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-[40px] bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-800">
          Review Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Employee Review History
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={review._id}
            className={`rounded-[28px] border bg-white/90 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              selectedReview?._id === review._id
                ? "border-indigo-500 ring-2 ring-indigo-200"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Review #{index + 1}
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {review.overallGrade}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              {review.reviewingOfficerId?.firstName}{" "}
              {review.reviewingOfficerId?.lastName}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {review.reviewingOfficerId?.department
                ?.department_name || "Department Not Assigned"}
            </p>

            <div className="mt-5 border-t pt-4">
              <p className="text-sm text-slate-500">
                Review Date
              </p>

              <p className="font-semibold text-slate-800">
                {new Date(
                  review.createdAt
                ).toLocaleDateString("en-IN")}
              </p>
            </div>

            <button
              onClick={() => handleViewDetails(review)}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {selectedReview?._id === review._id
                ? "Hide Details"
                : "View Details"}
            </button>
          </div>
        ))}
      </div>

      {/* Detail Section */}
      {selectedReview && (
  <div className="mt-10 overflow-hidden rounded-[36px] bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.12)]">

    {/* Header */}
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-10 py-8">

      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-white/70 uppercase tracking-[0.3em] text-xs">
            Review Assessment
          </p>

          <h2 className="mt-2 text-4xl font-black text-white">
            Review Details
          </h2>

          <p className="mt-3 text-white/80">
            {selectedReview.reviewingOfficerId?.firstName}{" "}
            {selectedReview.reviewingOfficerId?.lastName}
          </p>
        </div>

        <div className="mt-5 md:mt-0 rounded-3xl bg-white/15 backdrop-blur-xl px-8 py-5">
          <p className="text-white/70 text-sm">
            Overall Grade
          </p>

          <h3 className="text-4xl font-black text-white">
            {selectedReview.overallGrade}
          </h3>
        </div>
      </div>
    </div>

    <div className="p-8 lg:p-10">

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-[28px] bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg">
          <p className="text-sm text-slate-500">
            Assessment 1
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-800">
            {selectedReview.assessmentAgree1}
          </h3>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg">
          <p className="text-sm text-slate-500">
            Assessment 2
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-800">
            {selectedReview.assessmentAgree2}
          </h3>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-lg">
          <p className="text-sm text-emerald-700">
            Grade Score
          </p>

          <h3 className="mt-3 text-3xl font-black text-emerald-700">
            {selectedReview.overallGrade}
          </h3>
        </div>

      </div>

      {/* Comments */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="rounded-[30px] bg-gradient-to-br from-slate-50 to-white p-7 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800">
            Difference Reason
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            {selectedReview.differenceReason || "N/A"}
          </p>
        </div>

        <div className="rounded-[30px] bg-gradient-to-br from-slate-50 to-white p-7 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800">
            Pen Picture Comments
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            {selectedReview.penPictureComments || "N/A"}
          </p>
        </div>

      </div>

      {/* Bottom Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">


<div className="flex flex-col items-center">
  <label className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
    Reporting Officer Signature
  </label>

  <div className="flex h-40 w-72 items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-3 shadow-sm">
    <img
      src={`http://localhost:4000${selectedReview?.officerSignature?.url}`}
      alt="Reporting Officer Signature"
      className="max-h-full max-w-full object-contain"
    />
  </div>
</div>
        <div className="rounded-[28px] bg-white p-6 shadow-lg">
          <p className="text-sm text-slate-500">
            Name & Designation
          </p>

          <h4 className="mt-3 text-lg font-bold text-slate-800">
            {selectedReview.nameDesignation || "N/A"}
          </h4>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-indigo-50 to-violet-100 p-6 shadow-lg">
          <p className="text-sm text-indigo-600">
            Financial Year
          </p>

          <h4 className="mt-3 text-xl font-black text-indigo-700">
            {selectedReview.currentFinancialYear}
          </h4>
        </div>

      </div>

    </div>
  </div>
)}
    </div>
  );
}