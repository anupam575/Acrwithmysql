"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function Reviewing({ employeeId }) {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />
            <h2 className="mt-4 text-base font-bold text-slate-900">Loading Review Records</h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while reviewing-authority assessments are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
              —
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">No Reviews Found</h2>
            <p className="mt-1 text-sm text-slate-500">
              No reviewing-authority assessment records are currently available.
            </p>
          </div>
        </div>
      </div>
    );
  }

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

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Reviewing Authority Dashboard
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View the employee review history and inspect each reviewing-authority assessment.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Employee Assessment</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Review History</span>
          </div>
        </header>

      {/* Cards */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">Review Records</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a review to display its complete assessment details.
            </p>
          </div>

          <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={review._id}
            className={`rounded-md border p-4 transition ${
              selectedReview?._id === review._id
                ? "border-blue-800 bg-blue-50 ring-1 ring-blue-200"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                Review #{index + 1}
              </span>


            </div>

            <h3 className="mt-2 text-sm font-bold text-slate-900 sm:text-base">
              {review.reviewingOfficerId?.firstName}{" "}
            </h3>



            <button
              onClick={() => handleViewDetails(review)}
              className="mt-4 h-9 w-full rounded-md bg-blue-800 px-4 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              {selectedReview?._id === review._id
                ? "Hide Details"
                : "View Details"}
            </button>
          </div>
        ))}
          </div>
        </section>

        {/* Detail Section */}
      {selectedReview && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Review Assessment
                </p>

                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  Review Details
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  {selectedReview.reviewingOfficerId?.firstName}{" "}
                  {selectedReview.reviewingOfficerId?.lastName}
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-200">
                  Overall Grade
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  {selectedReview.overallGrade}
                </h3>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 lg:p-6">

            {/* Stats */}
            <div className="w-full space-y-5">

              {/* Top Stats */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

                {/* Assessment 1 */}
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Assessment 1
                  </p>

                  <h3 className="mt-2 break-words text-lg font-bold text-slate-900">
                    {selectedReview.assessmentAgree1 || "N/A"}
                  </h3>
                </div>

                {/* Assessment 2 */}
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Assessment 2
                  </p>

                  <h3 className="mt-2 break-words text-lg font-bold text-slate-900">
                    {selectedReview.assessmentAgree2 || "N/A"}
                  </h3>
                </div>

                {/* Overall Grade */}
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                    Overall Grade
                  </p>

                  <h3 className="mt-2 break-words text-xl font-bold text-emerald-700">
                    {selectedReview.overallGrade || "N/A"}
                  </h3>
                </div>

              </div>

              {/* Comments */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* Difference Reason */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Difference Reason
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {selectedReview.differenceReason || "N/A"}
                  </p>
                </div>

                {/* Pen Picture */}
                <div className="flex">
                  <div className="w-full rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Pen Picture Comments
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {selectedReview.penPictureComments || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">

                {/* Signature */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">

                  <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">
                    Reporting Officer Signature
                  </h3>

                  <div className="mt-3 flex min-h-28 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">

                    {selectedReview?.officerSignature?.url ? (
                      <img
                        src={`http://localhost:4000${selectedReview.officerSignature.url}`}
                        alt="Signature"
                        className="h-auto max-h-40 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm text-slate-400">
                        No Signature Available
                      </span>
                    )}

                  </div>

                </div>

                {/* Name & Designation */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Name & Designation
                  </p>

                  <h3 className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
                    {selectedReview.nameDesignation || "N/A"}
                  </h3>

                </div>

                {/* Financial Year */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">
                    Financial Year
                  </p>

                  <h3 className="mt-2 break-words text-lg font-bold text-blue-800">
                    {selectedReview.currentFinancialYear || "N/A"}
                  </h3>

                </div>

              </div>
            </div>
          </div>
        </section>
      )}

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Reviewing Authority Record • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
}