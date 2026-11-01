"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";

import DetailProfile from "../../../../../components/Word/detailalview";
import EmployeeProfile from "../../../../../components/Word/employeeview";
import DetailProfiling from "../../../../../components/details/DetailProfile";
import EmployeeProfileing from "../../../../../components/details/basic";

export default function Page() {
  const params = useParams();

  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const profileRef = useRef(null);
  const pageRef = useRef(null);

  const categoryKey = decodeURIComponent(
    Array.isArray(params?.category)
      ? params.category[0]
      : params?.category
  );

  console.log("CATEGORY KEY:", categoryKey);

  const isSenior =
    categoryKey.toLowerCase().trim() ===
    "senior and top managerial level";

  const isBasic =
    categoryKey.toLowerCase().trim() ===
    "supervisory and below supervisory category employees";

  // =========================
  // DOWNLOAD REPORT
  // =========================
  const handleFullExport = async () => {
    const children = [];

    children.push(...(profileRef.current?.getDocContent() || []));

    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, "Employee_Report.docx");
  };

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-slate-100"
    >
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <section className="overflow-hidden rounded-xl bg-[#0b4a7f] shadow-lg">

          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Government HRMS • APAR
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Employee Appraisal Report
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                Review employee appraisal details and download
                the complete appraisal report.
              </p>

            </div>

            <button
              onClick={handleFullExport}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#0b4a7f] shadow-md transition hover:bg-blue-50"
            >
              <Download size={18} />

              Download Full Report
            </button>

          </div>

        </section>

        {/* ====================================================== */}
        {/* WORD EXPORT */}
        {/* ====================================================== */}

        <section className="">

          {/* <div className="rounded-t-xl bg-slate-50 px-6 py-4">

            <h2 className="text-lg font-bold text-slate-800">
              Word Export Preview
            </h2>

          </div> */}

          <div className="p-6">

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

        </section>

        {/* ====================================================== */}
        {/* EMPLOYEE DETAILS */}
        {/* ====================================================== */}

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="rounded-t-xl bg-slate-50 px-6 py-4">

            <h2 className="text-lg font-bold text-slate-800">
              Employee Appraisal Details
            </h2>

          </div>

          <div className="p-6">

            {userId ? (
              isSenior ? (
                <DetailProfiling userId={userId} />
              ) : (
                <EmployeeProfileing userId={userId} />
              )
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
                Invalid Officer ID
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}