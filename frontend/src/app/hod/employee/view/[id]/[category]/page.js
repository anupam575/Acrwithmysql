"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";

import DetailProfile from "../../../../../components/Word/detailalview";
import EmployeeProfile from "../../../../../components/Word/employeeview";

import EmployeeDetailsView from "../../../../../components/Word/MOUProfile";
import SupDetailsView from "../../../../../components/Word/superapprisalview";
import EmployeeReviewHistory from "../../../../../components/Word/reviewaccept"
import SupReview from  "../../../../../components/Word/supreviewDetails";

import  Supaccept  from "../../../../../components/Word/supaccept";
import AparView from "../../../../../components/Word/aparview";
import AcceptanceDashboard from "../../../../components/Wordaccept";
import Reportingpage from "../../../../../components/details/supreportdetail";
import AcceptanceDashboarding from "../../../../../components/details/AcceptanceDashboard";
import ReportingViewing from "../../../../../components/details/AparView";
import DetailProfiling from "../../../../../components/details/DetailProfile";
import EmployeeProfileing from "../../../../../components/details/basic";
import Reviewing from "../../../../../components/details/EmployeeReviewHistory";
import SupReviewHistory from "../../../../../components/details/supreviewdetail";
import ReviewView from "../../../../../components/details/supreviewdetail"
import AcceptanceView from "../../../../../components/details/suppacceptdetail"
import EmployeeDetailsViewing from "../../../../../components/details/EmployeeDetailsView";
import SupervisorDetailsViewing from "../../../../../components/details/supervisor";
import ReportingOfficerDetail from "../../../../../components/Word/supereportview";
import { Download } from "lucide-react";
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";
export default function Page() {
  const params = useParams();
  const pageRef = useRef(null);
  const acceptanceRef = useRef();
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
    children.push(
      ...(acceptanceRef.current?.getDocContent() || [])
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
    ?    EmployeeDetailsViewing
    :    SupervisorDetailsViewing
 ;
  // =========================
  // STATE
  // =========================
  const [showProfile, setShowProfile] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showApar, setShowApar] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <>
      


      {/* Hidden Container For Word Download */}
      <div
        ref={pageRef}
        className="fixed -left-[99999px] top-0 w-[1200px] bg-white p-8"
      >
        <div className="space-y-10">
          {/* Section I */}
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

          {/* Section II */}
          <div>
            <h2 className="mb-4 border-b-2 border-emerald-600 pb-2 text-2xl font-bold text-emerald-700">
              Section II – Self Appraisal
            </h2>
<DetailsComponent
  ref={detailsRef}
  employeeId={userId}
/>
          </div>

         <div>
  <h2 className="mb-4 border-b-2 border-indigo-600 pb-2 text-2xl font-bold text-indigo-700">
    {isSenior
      ? "Section III – Reporting Authority"
      : "Section II – Reporting Officer Detail"}
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

          {/* Section V */}
          <div>
            <h2 className="mb-4 border-b-2 border-violet-600 pb-2 text-2xl font-bold text-violet-700">
              Section V – Acceptance Form
            </h2>

            
  {isSenior ? (
    <AcceptanceDashboard
      ref={acceptanceRef}
      employeeId={userId}
    />
  ) : (
    <Supaccept
      ref={acceptanceRef}
      employeeId={userId}
    />
  )}
      
          </div>
        </div>
      </div>

      {/* Visible UI */}
      <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* GOVERNMENT HEADER */}
          <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            <div className="bg-[#0b3a6f] px-4 py-5 text-white sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Annual Performance Appraisal Report
                  </p>

                  <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                    Complete Officer APAR Record
                  </h1>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Review all appraisal sections, reporting details, review history,
                    and acceptance information from one consolidated screen.
                  </p>
                </div>

                <button
                  onClick={handleFullExport}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white px-5 py-2.5 text-sm font-bold text-blue-900 shadow-sm transition hover:bg-blue-50 sm:w-fit"
                >
                  <Download size={18} strokeWidth={2.2} />
                  Download Full Report
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
              <span>Home</span>
              <span>/</span>
              <span>APAR Management</span>
              <span>/</span>
              <span className="font-semibold text-blue-800">
                Complete Officer Report
              </span>
            </div>
          </header>

          {/* INFORMATION STRIP */}
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Officer ID
              </p>
              <p className="mt-1 break-all text-sm font-bold text-slate-900">
                {userId || "Not Available"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Appraisal Category
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {isSenior ? "Senior and Top Managerial Level" : "Supervisory and Below"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
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
              className="flex w-full items-center justify-between gap-4 bg-[#0b3a6f] px-4 py-4 text-left text-white transition hover:bg-[#082f5b] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                  Section I
                </p>
                <span className="mt-1 block text-sm font-bold sm:text-base">
                  Basic Information
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-xl">
                {showProfile ? "−" : "+"}
              </span>
            </button>

            {showProfile && (
              <div className="border-l-4 border-[#0b3a6f] border-t border-slate-200 bg-white p-3 sm:p-5">
                {userId ? (
                  isSenior ? (
                    <DetailProfiling userId={userId} />
                  ) : (
                    <EmployeeProfileing userId={userId} />
                  )
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
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
              className="flex w-full items-center justify-between gap-4 bg-emerald-600 px-4 py-4 text-left text-white transition hover:bg-emerald-700 sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                  Section II
                </p>
                <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                  Self Appraisal
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/15 text-xl font-semibold text-white">
                {showEmployeeDetails ? "−" : "+"}
              </span>
            </button>

            {showEmployeeDetails && (
              <div className="border-l-4 border-emerald-600 border-t border-slate-200 bg-white p-3 sm:p-5">
                {userId ? (
                  <DetailsComponenting employeeId={userId} />
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    Invalid Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION III */}
          <section className="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
            <button
              onClick={() => setShowApar((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 bg-indigo-600 px-4 py-4 text-left text-white transition hover:bg-indigo-700 sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">
                  Section III
                </p>
                <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                  Reporting Authority
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/15 text-xl font-semibold text-white">
                {showApar ? "−" : "+"}
              </span>
            </button>

            {showApar && (
              <div className="border-l-4 border-indigo-600 border-t border-slate-200 bg-white p-3 sm:p-5">
                {userId ? (
                  isSenior ? (
                    <ReportingViewing employeeId={userId} />
                  ) : (
                    <Reportingpage employeeId={userId} />
                  )
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
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
              className="flex w-full items-center justify-between gap-4 bg-amber-500 px-4 py-4 text-left text-white transition hover:bg-amber-600 sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100">
                  Section IV
                </p>
                <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                  Review History
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/15 text-xl font-semibold text-white">
                {showReviewHistory ? "−" : "+"}
              </span>
            </button>

            {showReviewHistory && (
              <div className="border-l-4 border-amber-500 border-t border-slate-200 bg-white p-3 sm:p-5">
                {userId ? (
                  isSenior ? (
                    <Reviewing employeeId={userId} />
                  ) : (
                    <ReviewView employeeId={userId} />
                  )
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
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
              className="flex w-full items-center justify-between gap-4 bg-violet-600 px-4 py-4 text-left text-white transition hover:bg-violet-700 sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-100">
                  Section V
                </p>
                <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                  Acceptance Dashboard
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/15 text-xl font-semibold text-white">
                {showReviewForm ? "−" : "+"}
              </span>
            </button>

            {showReviewForm && (
              <div className="border-l-4 border-violet-600 border-t border-slate-200 bg-white p-3 sm:p-5">
                {userId ? (
                  isSenior ? (
                    <AcceptanceDashboarding employeeId={userId} />
                  ) : (
                    <AcceptanceView employeeId={userId} />
                  )
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    Invalid Officer ID
                  </div>
                )}
              </div>
            )}
          </section>

          <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
            Annual Performance Appraisal Report • Official Administration Portal
          </footer>
        </div>
      </div>
    </>
  );
}