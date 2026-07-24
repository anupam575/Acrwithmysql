"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

import {
  CalendarToday,
  Timeline,
  Person,
  Description,
  RateReview,
  Verified,
  WorkspacePremium,
  BadgeOutlined,
  Cancel,
} from "@mui/icons-material";

export default function AcceptanceDashboard({ employeeId }) {

  /* =====================================================
      STATE
  ===================================================== */

  // All acceptance records from API
  const [data, setData] = useState([]);

  // Loading & error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected card index (left panel)
  const [selectedCard, setSelectedCard] = useState(0);

  // Currently selected record (right panel)
  const [currentItem, setCurrentItem] = useState(null);

  // Active tab (overview / details / signature)
  /* =====================================================
      FETCH ACCEPTANCE
  ===================================================== */

  useEffect(() => {
    if (employeeId) {
      fetchAcceptance();
    }
  }, [employeeId]);

  const fetchAcceptance = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/accept/employee/acceptanceid/${employeeId}`
      );

      const records = res?.data?.data || [];

      setData(records);

      if (records.length > 0) {
        setSelectedCard(0);
        setCurrentItem(records[0]);
      } else {
        setCurrentItem(null);
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load acceptance records."
      );

      setData([]);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      CARD CLICK HANDLER
  ===================================================== */

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setCurrentItem(data[index]);
  };

  /* =====================================================
      TAB CLICK HANDLER
  ===================================================== */

  /* =====================================================
      LOADING UI
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="rounded-[40px] bg-white px-14 py-14 shadow-2xl">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-[6px] border-indigo-600 border-t-transparent" />

          <h2 className="mt-8 text-center text-2xl font-bold text-slate-800">
            Loading Acceptance Data
          </h2>

          <p className="mt-2 text-center text-slate-500">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
      ERROR UI
  ===================================================== */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="rounded-[35px] bg-white p-12 shadow-2xl">

          <Cancel className="mx-auto text-red-500" sx={{ fontSize: 70 }} />

          <h2 className="mt-5 text-center text-3xl font-bold text-slate-800">
            Something Went Wrong
          </h2>

          <p className="mt-3 text-center text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchAcceptance}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Retry
          </button>

        </div>
      </div>
    );
  }

  /* =====================================================
      EMPTY STATE
  ===================================================== */

  if (!data.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

        <div className="rounded-[35px] bg-white p-14 text-center shadow-2xl">

          <Description className="mx-auto text-indigo-500" sx={{ fontSize: 75 }} />

          <h2 className="mt-6 text-3xl font-bold text-slate-800">
            No Acceptance Record Found
          </h2>

          <p className="mt-3 text-slate-500">
            There are no acceptance records available.
          </p>

        </div>

      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gradient-to-br   from-slate-100 via-indigo-50 to-blue-100">
      {/* Decorative Blur */}
      <div className="fixed left-0 top-0 h-96 w-96 rounded-full bg-indigo-300/30 blur-[180px]" />
      <div className="fixed right-0 bottom-0 h-96 w-96 rounded-full bg-sky-300/30 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl p-8">

        {/* ================= HERO SECTION ================= */}
        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-indigo-700 via-violet-700 to-blue-700 p-10 shadow-[0_25px_60px_rgba(79,70,229,0.35)]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            {/* Left Hero Content */}
            <div>
              <div className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 backdrop-blur-xl">
                <WorkspacePremium sx={{ fontSize: 22 }} className="mr-2 text-yellow-300" />
                <span className="font-semibold tracking-wide text-white">
                  Employee Acceptance Dashboard
                </span>
              </div>

              <h1 className="mt-6 text-5xl font-black leading-tight text-white">
                Performance Acceptance
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
                View acceptance records, grading, remarks, and authority details.
              </p>
            </div>

            {/* Right Hero Stats */}
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white/15 p-6 backdrop-blur-xl">
                <h3 className="text-4xl font-black text-white">
                  {data.length}
                </h3>
                <p className="mt-2 text-indigo-100">Total Records</p>
              </div>

              <div className="rounded-3xl bg-white/15 p-6  backdrop-blur-xl">
                <Verified sx={{ fontSize: 45 }} className="text-emerald-300" />
                <p className="mt-3 text-white">Acceptance Verified</p>
              </div>
            </div>

          </div>
        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 gap-6">

  {data.map((item, index) => (
    <div
      key={item._id}
      onClick={() => handleCardClick(index)}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-2 ${
        selectedCard === index
          ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-white shadow-2xl ring-2 ring-indigo-300"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl"
      }`}
    >

      {/* Glow Background */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl opacity-0 transition group-hover:opacity-100"></div>

      {/* Top Badge */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600">
          #{index + 1}
        </span>

        <span className="text-xs font-semibold text-slate-400">
          FY {item.currentFinancialYear}
        </span>
      </div>

      {/* Main Value */}
      <h3 className="mt-4 text-xl font-black text-slate-800 group-hover:text-indigo-600 transition">
        Grade: {item.overallGrade}
      </h3>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-slate-600 line-clamp-1">
        {item.acceptingAuthorityNameDesignation}
      </p>

      {/* Footer Row */}
      <div className="mt-5 flex items-center justify-between">

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Status</span>
          <span className={`text-xs font-bold ${
            item.overallGradeConsistent === "Yes"
              ? "text-emerald-600"
              : "text-red-500"
          }`}>
            {item.overallGradeConsistent}
          </span>
        </div>

        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
          <span className="text-indigo-600 font-bold">
            →
          </span>
        </div>

      </div>

    </div>
  ))}
</div>
                      {/* ================= TABS ================= */}
{/* ================= CONTENT ================= */}
<div className="p-8">

  {/* Info Cards */}
  <div className="grid gap-6 lg:grid-cols-4">
    <InfoCard
      icon={<RateReview sx={{ color: "#4F46E5" }} />}
      label="Overall Grade"
      value={currentItem?.overallGrade}
    />

    <InfoCard
      icon={<Description sx={{ color: "#9333EA" }} />}
      label="Difference Opinion"
      value={currentItem?.differenceOpinion || "N/A"}
    />

    <InfoCard
      icon={<BadgeOutlined sx={{ color: "#2563EB" }} />}
      label="Authority"
      value={currentItem?.acceptingAuthorityNameDesignation}
    />

    <InfoCard
      icon={<CalendarToday sx={{ color: "#EA580C" }} />}
      label="Created"
      value={
        currentItem?.createdAt
          ? new Date(currentItem.createdAt).toLocaleDateString("en-IN")
          : "N/A"
      }
    />
  </div>

  {/* Details + Signature */}
  <div className="mt-8 grid gap-7 lg:grid-cols-2">

    {/* Left Side */}
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
      <h3 className="text-xl font-bold text-slate-800">
        Acceptance Information
      </h3>

      <div className="mt-6 space-y-5">

        <div className="flex justify-between">
          <span className="text-slate-500">Financial Year</span>
          <span className="font-semibold text-slate-800">
            {currentItem?.currentFinancialYear}
          </span>
        </div>

        

        <div className="flex justify-between">
          <span className="text-slate-500">Overall Grade</span>
          <span className="font-bold text-indigo-600">
            {currentItem?.overallGrade}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Grade Consistent</span>
          <span className="font-semibold">
            {currentItem?.overallGradeConsistent}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Agree With Remarks</span>
          <span className="font-semibold">
            {currentItem?.agreeWithRemarks}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Difference Opinion</span>
          <span className="font-semibold">
            {currentItem?.differenceOpinion || "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Authority</span>
          <span className="font-semibold">
            {currentItem?.acceptingAuthorityNameDesignation}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Created</span>
          <span className="font-semibold">
            {currentItem?.createdAt
              ? new Date(currentItem.createdAt).toLocaleDateString("en-IN")
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Updated</span>
          <span className="font-semibold">
            {currentItem?.updatedAt
              ? new Date(currentItem.updatedAt).toLocaleDateString("en-IN")
              : "N/A"}
          </span>
        </div>

      </div>
    </div>

    {/* Right Side Signature */}
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8">
      <h3 className="mb-6 text-center text-xl font-bold text-slate-800">
        Accepting Authority Signature
      </h3>

      <div className="flex h-56 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100">
        {currentItem?.officerSignature?.url ? (
          <img
            src={`http://localhost:4000${currentItem.officerSignature.url}`}
            alt="Officer Signature"
            className="max-h-44 object-contain"
          />
        ) : (
          <span className="text-slate-500">
            No Signature Uploaded
          </span>
        )}
      </div>

      {currentItem?.officerSignature && (
        <div className="mt-6 rounded-2xl bg-slate-100 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">File</span>
            <span className="font-semibold">
              {currentItem.officerSignature.originalName}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-500">Size</span>
            <span>
              {(currentItem.officerSignature.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}
    </div>

  </div>
</div>
                            {/* ================= FOOTER ================= */}
              <div className="border-t border-slate-200 bg-slate-50 px-8 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <p className="text-sm text-slate-500">
                    Employee Acceptance Dashboard • Powered by HR System
                  </p>

                  <p className="text-sm font-semibold text-slate-600">
                    Total Records: {data.length}
                  </p>

                </div>
              </div>

            </div> 
          </div>

  );
}

/* ================= BADGE COMPONENT ================= */
function Badge({ label, type }) {
  const colors = {
    green: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
        colors[type] || colors.blue
      }`}
    >
      {label}
    </span>
  );
}

/* ================= INFO CARD COMPONENT ================= */
function InfoCard({ icon, label, value }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <h3 className="mt-1 break-words text-lg font-bold text-slate-800">
            {value ?? "N/A"}
          </h3>
        </div>

      </div>
    </div>
  );
}