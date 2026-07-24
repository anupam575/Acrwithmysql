"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import EmployeeDetailsView from "../../../../components/MOUProfile";
import SupervisorDetailsView from "../../../../components/supervisorview";
import EmployeeDetailsViewing from "../../../../components/EmployeeDetailsView";
import SupervisorDetailsViewing from "../../../../components/supervisor";
import DetailProfiling from "../../../../../components/details/DetailProfile";
import EmployeeProfileing from "../../../../../components/details/basic";
import PerformanceReviewPage from "../../../../components/PerformanceReviewPage";
import AparForm from "../../../../components/AparForm";
import SupDetailsView from "../../../../../components/Word/superapprisalview";

import DetailProfile from "../../../../../components/Word/detailalview";
import EmployeeProfile from "../../../../../components/Word/employeeview";
import { Document, Packer } from "docx";

import { saveAs } from "file-saver";

export default function Page() {
  const params = useParams();
  
  const pageRef = useRef(null);

  const profileRef = useRef();
  const detailsRef = useRef();

  const handleFullExport = async () => {
    const children = [];

    children.push(...(profileRef.current?.getDocContent() || []));

    children.push(...(detailsRef.current?.getDocContent() || []));

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

  const handleDownload = () => {
    if (!pageRef.current) return;

    downloadPageAsWord(pageRef.current);
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
  // COLLAPSE STATES
  // =========================
  const [showProfile, setShowProfile] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] =
    useState(false);
  const [showAssessmentForm, setShowAssessmentForm] =
    useState(false);

  return (
    <>
      {/* ========================= */}
      {/* Hidden Components for DOCX Export */}
      {/* ========================= */}
      <div
        ref={pageRef}
        className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0"
      >
        <div className="w-[1200px] bg-white p-8">
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
          <div className="mt-8">
            <h2 className="mb-4 border-b-2 border-emerald-600 pb-2 text-2xl font-bold text-emerald-700">
              Section II – Self-appraisal
            </h2>

            {userId && (
              <DetailsComponent
                ref={detailsRef}
                employeeId={userId}
              />
            )}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* Visible UI */}
      {/* ========================= */}
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
                    Reporting Authority Assessment
                  </h1>

                  <p className="mt-1 max-w-4xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Review officer information, self-appraisal details, and the
                    reporting authority assessment from one consolidated screen.
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
                Reporting Authority Assessment
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
            <div>
  <p>categoryKey: {categoryKey}</p>
  <p>isSenior: {String(isSenior)}</p>
</div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Report Sections
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Three Consolidated Sections
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
                {isSenior && userId && (
                  <DetailProfiling userId={userId} />
                )}

                {isBasic && userId && (
                  <EmployeeProfileing userId={userId} />
                )}

                {!isSenior && !isBasic && userId && (
                  <EmployeeProfileing userId={userId} />
                )}

                {!userId && (
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
              onClick={() =>
                setShowEmployeeDetails((prev) => !prev)
              }
              className="flex w-full items-center justify-between gap-4 bg-[#08a274] px-5 py-4 text-left text-white transition hover:bg-[#078c65] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                  Section II
                </p>

                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Self-appraisal of the Officer Reported Upon
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
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    Loading officer details...
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION III */}
          <section className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
            <button
              onClick={() =>
                setShowAssessmentForm((prev) => !prev)
              }
              className="flex w-full items-center justify-between gap-4 bg-[#8a17f5] px-5 py-4 text-left text-white transition hover:bg-[#7412d1] sm:px-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-100">
                  Section III
                </p>

                <h2 className="mt-1 text-sm font-bold sm:text-base">
                  Appraisal of the Reporting Authority
                </h2>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-xl font-semibold">
                {showAssessmentForm ? "−" : "+"}
              </span>
            </button>

            {showAssessmentForm && (
              <div className="border-l-4 border-[#8a17f5] border-t border-violet-100 bg-white p-3 sm:p-6">
                {categoryKey ===
                "senior and top managerial level" ? (
                  <AparForm employeeId={userId} />
                ) : (
                  <PerformanceReviewPage employeeId={userId} />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}