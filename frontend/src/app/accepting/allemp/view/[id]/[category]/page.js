"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";

import DetailProfile from "../../../../../components/Word/detailalview";
import EmployeeProfile from "../../../../../components/Word/employeeview";
import SupDetailsView from "../../../../../components/Word/superapprisalview";
import SupReview from "../../../../../components/Word/supreviewDetails";
import Reportingpage from "../../../../../components/details/supreportdetail";

import EmployeeDetailsView from "../../../../../components/Word/MOUProfile";
import EmployeeReviewHistory from "../../../../../components/Word/reviewaccept"
import AparView from "../../../../../components/Word/aparview";

import ReportingViewing from "../../../../../components/details/AparView";
import DetailProfiling from "../../../../../components/details/DetailProfile";
import EmployeeProfileing from "../../../../../components/details/basic";
import Reviewing from "../../../../../components/details/EmployeeReviewHistory"
import ReportingOfficerDetail from "../../../../../components/Word/supereportview";

import EmployeeDetailsViewing from "../../../../../components/details/EmployeeDetailsView";
import SupervisorDetailsViewing from "../../../../../components/details/supervisor";
import ReviewView from "../../../../../components/details/supreviewdetail"
import AcceptanceFormProvider from "../../../../components/AcceptanceFormProvider";
import PerformanceReviewContainer from "../../../../components/PerformanceReviewContainer";
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";

export default function Page() {
  const params = useParams();
  const pageRef = useRef(null);
  const profileRef = useRef();
  const detailsRef = useRef();
  const aparRef = useRef();
  const reviewHistoryRef = useRef();
  const handleFullExport = async () => {
    const children = [];
    // Section V

    children.push(
      ...(profileRef.current?.getDocContent() || [])
    );

    // Section II
    children.push(
      ...(detailsRef.current?.getDocContent() || [])
    );

    // Section III
    children.push(
      ...(aparRef.current?.getDocContent() || [])
    );

    // Section IV
    children.push(
      ...(reviewHistoryRef.current?.getDocContent() || [])
    );



    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, "Full_Report.docx");
  };
  
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

const categoryKey = decodeURIComponent(
  Array.isArray(params?.category)
    ? params.category[0]
    : params?.category
);

const isSenior =
  categoryKey.toLowerCase().trim() ===
  "senior and top managerial level";

const isBasic =
  categoryKey.toLowerCase().trim() ===
  "supervisory and below supervisory category employees";



    
  const DetailsComponent = isSenior
    ? EmployeeDetailsView
    : SupDetailsView;

  const DetailsComponenting = isSenior
    ? EmployeeDetailsViewing
    : SupervisorDetailsViewing
    ;
  // =========================
  // STATES
  // =========================
  const [showProfile, setShowProfile] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showApar, setShowApar] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);

  // =========================
  // DOWNLOAD
  // =========================
  const handleDownload = () => {
    if (!pageRef.current) return;

    downloadPageAsWord(pageRef.current);
  };

  return (
    <>
      {/* ================= DOWNLOAD BUTTON ================= */}
      

      {/* ================= HIDDEN EXPORT CONTAINER ================= */}

      <div
        ref={pageRef}
        className="absolute left-0 top-0 -z-10 w-[1200px] bg-white p-8 opacity-0 pointer-events-none"
      >
        <div className="space-y-10">
          {/* SECTION I */}

          <div>
            <h2 className="mb-4 border-b-2 border-blue-600 pb-2 text-2xl font-bold text-blue-700">
              Section I – Basic Information
            </h2>
            {userId &&
              (isSenior ? (
                <DetailProfile
                  ref={profileRef}
                  userId={userId}
                />
              ) : (
                <EmployeeProfile
                  ref={profileRef}
                  userId={userId}
                />
              ))}
          </div>

          {/* SECTION II */}

          <div>
            <h2 className="mb-4 border-b-2 border-emerald-600 pb-2 text-2xl font-bold text-emerald-700">
              Section II – Self-appraisal
            </h2>
            <DetailsComponent
              ref={detailsRef}
              employeeId={userId}
            />
          </div>

          {/* SECTION III */}

          <div>
            <h2 className="mb-4 border-b-2 border-indigo-600 pb-2 text-2xl font-bold text-indigo-700">
              Section III – Reporting Authority
            </h2>
            {isSenior ? (
              <AparView
                ref={aparRef}
                employeeId={userId}
              />
            ) : (
              <ReportingOfficerDetail
                ref={aparRef}
                employeeId={userId}
              />
            )}
          </div>

          {/* SECTION IV */}

          <div>
            <h2 className="mb-4 border-b-2 border-amber-600 pb-2 text-2xl font-bold text-amber-700">
              Section IV – Review History
            </h2>
            {isSenior ? (
              <EmployeeReviewHistory
                ref={reviewHistoryRef}
                employeeId={userId}
              />
            ) : (
              <SupReview
                ref={reviewHistoryRef}
                employeeId={userId}
              />
            )}
          </div>

          {/* SECTION V */}


        </div>
      </div>

      {/* ================= VISIBLE UI STARTS HERE ================= */}

      <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* TOP HEADER */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100 sm:text-xs">
                    Annual Performance Appraisal Report
                  </p>

                  <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                    Complete Officer APAR Record
                  </h1>

                  <p className="mt-1 max-w-4xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Review all appraisal sections, reporting details, review
                    history, and acceptance information from one consolidated
                    screen.
                  </p>
                </div>

                <button
                  onClick={handleFullExport}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white px-5 py-2.5 text-sm font-bold text-[#0b4a7f] shadow-sm transition hover:bg-blue-50 sm:w-fit"
                >
                  <Download size={18} strokeWidth={2.2} />
                  Download Full Report
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
              <span>Home</span>
              <span>/</span>
              <span>APAR Management</span>
              <span>/</span>
              <span className="font-semibold text-[#0b4a7f]">
                Complete Officer Report
              </span>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Officer ID
              </p>
              <p className="mt-1 break-all text-sm font-bold text-slate-900">
                {userId || "Not Available"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Appraisal Category
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {isSenior
                  ? "Senior and Top Managerial Level"
                  : "Supervisory and Below"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Report Sections
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Five Consolidated Sections
              </p>
            </div>
          </section>

          {/* SECTION I */}
          <section className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-[#0b4a7f] px-5 py-4 text-left text-white transition hover:bg-[#083c67] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                  Section I
                </p>
                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Basic Information
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showProfile ? "−" : "+"}
              </span>
            </button>

            {showProfile && (
              <div className="border-l-4 border-[#0b4a7f] border-t border-blue-100 bg-white p-3 sm:p-6">
                {userId ? (
                  isSenior ? (
                    <DetailProfiling userId={userId} />
                  ) : (
                    <EmployeeProfileing userId={userId} />
                  )
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Invalid Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION II */}
          <section className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
            <button
              onClick={() => setShowEmployeeDetails((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-[#08a274] px-5 py-4 text-left text-white transition hover:bg-[#078c65] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                  Section II
                </p>
                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Self-appraisal
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showEmployeeDetails ? "−" : "+"}
              </span>
            </button>

            {showEmployeeDetails && (
              <div className="border-l-4 border-[#08a274] border-t border-emerald-100 bg-white p-3 sm:p-6">
                {userId ? (
                  <DetailsComponenting employeeId={userId} />
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Invalid or missing Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION III */}
          <section className="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
            <button
              onClick={() => setShowApar((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-[#4935df] px-5 py-4 text-left text-white transition hover:bg-[#3e2ccc] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100">
                  Section III
                </p>
                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Reporting Authority
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showApar ? "−" : "+"}
              </span>
            </button>

            {showApar && (
              <div className="border-l-4 border-[#4935df] border-t border-indigo-100 bg-white p-3 sm:p-6">
                {userId ? (
                  isSenior ? (
                    <ReportingViewing employeeId={userId} />
                  ) : (
                    <Reportingpage employeeId={userId} />
                  )
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Invalid Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION IV */}
          <section className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
            <button
              onClick={() => setShowReviewHistory((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-[#ff9200] px-5 py-4 text-left text-white transition hover:bg-[#e88400] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100">
                  Section IV
                </p>
                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Review History
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showReviewHistory ? "−" : "+"}
              </span>
            </button>

            {showReviewHistory && (
              <div className="border-l-4 border-[#ff9200] border-t border-amber-100 bg-white p-3 sm:p-6">
                {userId ? (
                  isSenior ? (
                    <Reviewing employeeId={userId} />
                  ) : (
                    <ReviewView employeeId={userId} />
                  )
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Invalid Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION V */}
          <section className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
            <button
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-[#8a17f5] px-5 py-4 text-left text-white transition hover:bg-[#7412d1] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-100">
                  Section V
                </p>
                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Acceptance Form
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showReviewForm ? "−" : "+"}
              </span>
            </button>

            {showReviewForm && (
              <div className="border-l-4 border-[#8a17f5] border-t border-violet-100 bg-white p-3 sm:p-6">
                {categoryKey ===
                "senior and top managerial level" ? (
                  <AcceptanceFormProvider employeeId={userId} />
                ) : (
                  <PerformanceReviewContainer employeeId={userId} />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}