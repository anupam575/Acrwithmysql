"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

import {
  CalendarToday,
  Description,
  RateReview,
  BadgeOutlined,
  Cancel,
} from "@mui/icons-material";

export default function AcceptanceDashboarding({ employeeId }) {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Acceptance Data
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while acceptance records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="h-1.5 bg-red-600" />

          <div className="px-6 py-8 text-center">
            <Cancel className="mx-auto text-red-600" sx={{ fontSize: 48 }} />

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to Load Acceptance Records
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>

            <button
              type="button"
              onClick={fetchAcceptance}
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <Description className="mx-auto text-blue-800" sx={{ fontSize: 46 }} />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              No Acceptance Record Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              There are no acceptance records available.
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
                  Employee Acceptance Dashboard
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View acceptance records, grading consistency, remarks,
                  authority information, and digital signatures.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:min-w-[270px]">
                <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Total Records
                  </p>

                  <p className="mt-1 text-lg font-bold">{data.length}</p>
                </div>

                <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-300">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Performance Appraisal</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Acceptance Dashboard
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Acceptance Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a financial-year record to view complete acceptance details.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {data.map((item, index) => (
              <button
                type="button"
                key={item._id}
                onClick={() => handleCardClick(index)}
                className={`min-w-[235px] rounded-md border p-3 text-left transition ${
                  selectedCard === index
                    ? "border-blue-800 bg-blue-800 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                      selectedCard === index
                        ? "bg-white/15 text-white"
                        : "bg-blue-50 text-blue-800"
                    }`}
                  >
                    #{index + 1}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      selectedCard === index
                        ? "text-blue-200"
                        : "text-slate-500"
                    }`}
                  >
                    FY {item.currentFinancialYear}
                  </span>
                </div>

                <div
                  className={`mt-3 border-t pt-3 ${
                    selectedCard === index
                      ? "border-white/20"
                      : "border-slate-200"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      selectedCard === index
                        ? "text-blue-200"
                        : "text-slate-500"
                    }`}
                  >
                    Grade Consistency
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      selectedCard === index
                        ? "text-white"
                        : item.overallGradeConsistent === "Yes"
                          ? "text-emerald-700"
                          : "text-red-600"
                    }`}
                  >
                    {item.overallGradeConsistent}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Acceptance Authority Assessment
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Acceptance Information
                </h2>

                <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                  Complete grading, authority, date, and signature details
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Financial Year
                </p>

                <p className="mt-1 text-base font-bold">
                  {currentItem?.currentFinancialYear}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                icon={<RateReview sx={{ fontSize: 20 }} />}
                label="Overall Grade"
                value={currentItem?.overallGrade}
              />

              <InfoCard
                icon={<Description sx={{ fontSize: 20 }} />}
                label="Difference Opinion"
                value={currentItem?.differenceOpinion || "N/A"}
              />

              <InfoCard
                icon={<BadgeOutlined sx={{ fontSize: 20 }} />}
                label="Authority"
                value={currentItem?.acceptingAuthorityNameDesignation}
              />

              <InfoCard
                icon={<CalendarToday sx={{ fontSize: 20 }} />}
                label="Created"
                value={
                  currentItem?.createdAt
                    ? new Date(currentItem.createdAt).toLocaleDateString("en-IN")
                    : "N/A"
                }
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Acceptance Details
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Assessment and authority information
                  </p>
                </div>

                <div className="divide-y divide-slate-100 p-4">
                  <DetailRow
                    label="Financial Year"
                    value={currentItem?.currentFinancialYear}
                  />

                  <DetailRow
                    label="Overall Grade"
                    value={currentItem?.overallGrade}
                    valueClass="text-blue-800"
                  />

                  <DetailRow
                    label="Grade Consistent"
                    value={currentItem?.overallGradeConsistent}
                  />

                  <DetailRow
                    label="Agree With Remarks"
                    value={currentItem?.agreeWithRemarks}
                  />

                  <DetailRow
                    label="Difference Opinion"
                    value={currentItem?.differenceOpinion || "N/A"}
                  />

                  <DetailRow
                    label="Authority"
                    value={currentItem?.acceptingAuthorityNameDesignation}
                  />

                  <DetailRow
                    label="Created"
                    value={
                      currentItem?.createdAt
                        ? new Date(currentItem.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"
                    }
                  />

                  <DetailRow
                    label="Updated"
                    value={
                      currentItem?.updatedAt
                        ? new Date(currentItem.updatedAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"
                    }
                  />
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center">
                  <h3 className="text-sm font-bold text-slate-900">
                    Accepting Authority Signature
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Uploaded digital signature and file information
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex min-h-44 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
                    {currentItem?.officerSignature?.url ? (
                      <img
                        src={`http://localhost:4000${currentItem.officerSignature.url}`}
                        alt="Officer Signature"
                        className="max-h-32 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-400">
                        No Signature Uploaded
                      </span>
                    )}
                  </div>

                  {currentItem?.officerSignature && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <DetailRow
                        label="File"
                        value={currentItem.officerSignature.originalName}
                      />

                      <DetailRow
                        label="Size"
                        value={`${(
                          currentItem.officerSignature.size / 1024
                        ).toFixed(1)} KB`}
                      />
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="flex flex-col gap-1 text-center text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <p>
              Employee Acceptance Dashboard • Performance Appraisal Management
              System
            </p>

            <p className="font-semibold text-slate-600">
              Total Records: {data.length}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueClass = "text-slate-800" }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-xs text-slate-500">{label}</span>

      <span
        className={`break-words text-xs font-semibold sm:max-w-[65%] sm:text-right ${valueClass}`}
      >
        {value ?? "N/A"}
      </span>
    </div>
  );
}

/* ================= INFO CARD COMPONENT ================= */
function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-800">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
            {label}
          </p>

          <h3 className="mt-1 break-words text-sm font-bold leading-5 text-slate-900">
            {value ?? "N/A"}
          </h3>
        </div>
      </div>
    </div>
  );
}