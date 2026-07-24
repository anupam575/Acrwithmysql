"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FilePlus2,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import UIPagination from "../../components/section/ui/pagination";
import ActionDropdown from "../../components/section/ui/ActionDropdown";
import useAppraisals from "../components/useAppraisals";

export default function AppraisalFunction() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const router = useRouter();

  const {
    filteredAppraisals,
    loading,
    totalPages,
    handleUpdate,
    handleView,
    handleDelete,
  } = useAppraisals(page, setPage, limit, search);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#0b4a7f]" />

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Loading Self-Appraisals
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while appraisal records are retrieved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* PAGE HEADER */}
        <section className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Annual Performance Appraisal Report
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Self-Appraisal Management
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View, search, update, and manage officer self-appraisal
                  records from a single dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/employee/SelfAppraisalForm")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-[#0b4a7f] shadow-sm transition hover:bg-blue-50 sm:w-fit"
              >
                <FilePlus2 size={18} />
                Add Appraisal
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
            <span>Home</span>
            <span>/</span>
            <span>APAR Management</span>
            <span>/</span>
            <span className="font-semibold text-[#0b4a7f]">
              Self-Appraisals
            </span>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<ClipboardList size={20} />}
            label="Visible Records"
            value={filteredAppraisals.length}
          />

          <SummaryCard
            icon={<CalendarDays size={20} />}
            label="Current Page"
            value={page}
          />

          <SummaryCard
            icon={<Building2 size={20} />}
            label="Page Size"
            value={limit}
          />

          <SummaryCard
            icon={<ShieldCheck size={20} />}
            label="Record Status"
            value="Available"
          />
        </section>

        {/* SEARCH AND DIRECTORY */}
        <section className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Appraisal Directory
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complete self-appraisal management and record tracking.
                </p>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search appraisals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="min-h-11 w-full rounded-md border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0b4a7f] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden  lg:block">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f8fafc]">
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Sr. No.
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Financial Year
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Task Weightage
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Grand Total
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Reporting Officer
                  </th>

                  <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAppraisals.length > 0 ? (
                  filteredAppraisals.map((appraisal, index) => (
                    <tr
                      key={appraisal._id}
                      className="border-b border-slate-100 bg-white transition hover:bg-blue-50/50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          type="blue"
                          value={appraisal.currentFinancialYear || "-"}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          type="amber"
                          value={appraisal.calculatedTotalTaskWeightage || "-"}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          type="green"
                          value={appraisal.calculatedGrandTotal || "-"}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {appraisal.department?.department_name || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {appraisal.reportingOfficerId?.firstName || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <div className="rounded-md border border-slate-200 bg-white p-1.5 shadow-sm">
                            <ActionDropdown
                              onUpdate={() => handleUpdate(appraisal)}
                              onView={() => handleView(appraisal)}
                              onDelete={() => handleDelete(appraisal)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="space-y-3 p-3 lg:hidden">
            {filteredAppraisals.length > 0 ? (
              filteredAppraisals.map((appraisal, index) => (
                <article
                  key={appraisal._id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Record No.
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-900">
                        {(page - 1) * limit + index + 1}
                      </p>
                    </div>

                    <StatusBadge
                      type="blue"
                      value={appraisal.currentFinancialYear || "-"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4">
                    <MobileDetail
                      label="Task Weightage"
                      value={appraisal.calculatedTotalTaskWeightage || "-"}
                    />

                    <MobileDetail
                      label="Grand Total"
                      value={appraisal.calculatedGrandTotal || "-"}
                    />

                    <MobileDetail
                      label="Department"
                      value={appraisal.department?.department_name || "-"}
                    />

                    <MobileDetail
                      label="Reporting Officer"
                      value={appraisal.reportingOfficerId?.firstName || "-"}
                    />
                  </div>

                  <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="rounded-md border border-slate-200 bg-white p-1.5 shadow-sm">
                      <ActionDropdown
                        onUpdate={() => handleUpdate(appraisal)}
                        onView={() => handleView(appraisal)}
                        onDelete={() => handleDelete(appraisal)}
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="py-10">
                <EmptyState />
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center border-t border-slate-200 bg-slate-50 px-4 py-5">
            <UIPagination
              totalPages={totalPages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ type, value }) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        styles[type] || styles.blue
      }`}
    >
      {value}
    </span>
  );
}

function MobileDetail({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0b4a7f]">
        <UserCheck size={30} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        No Appraisals Found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        No self-appraisal records are available for the current search.
      </p>
    </div>
  );
}