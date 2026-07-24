"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UIPagination from "../../components/section/ui/pagination";
import useEmployees from "../../components/section/useEmployees";
import ActionDropdown from "../../components/section/ui/ActionDropdown";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import BadgeIcon from "@mui/icons-material/Badge";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [assessmentYear, setAssessmentYear] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const router = useRouter();
const {
  filteredEmployees,
  loading,
  totalPages,
  allFinancialYears,
  handleUpdate,
  handleView,
  handleDelete,
} = useEmployees(page, setPage, limit, search, assessmentYear); 
  const getAssessmentYear = (emp) =>
    emp?.assessmentYear?.name ||
    emp?.assessmentYear?.year ||
    emp?.assessmentYear ||
    emp?.assessment_year ||
    emp?.appraisalYear ||
    emp?.currentFinancialYear ||
    emp?.financialYear ||
    "";
const displayedEmployees = filteredEmployees;
  const handleAssessmentYearChange = (e) => {
    setAssessmentYear(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />

          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AccessTimeIcon fontSize="small" />
            Loading officer records...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please wait while officer records are being retrieved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* ================= GOVERNMENT HEADER ================= */}

        <header className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-5 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                  <BadgeIcon className="!text-3xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Human Resource Administration
                  </p>

                  <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                    Officer Management
                  </h1>

                  <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                    Manage officer records and assessment-year information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/hr/employee/create")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white px-5 py-2.5 text-sm font-bold text-blue-900 shadow-sm transition hover:bg-blue-50 sm:w-fit"
              >
                <AddIcon fontSize="small" />
                Add Officer
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Human Resource</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Officer Management
            </span>
          </div>
        </header>

        {/* ================= FILTER PANEL ================= */}

        <section className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
                <FilterAltIcon className="!text-blue-800" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Search and Filter
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Search officer records and filter them by assessment year.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2 sm:p-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                Search Officer
              </label>

              <div className="relative">
                <SearchIcon className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-xl !text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by code, email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                Assessment Year
              </label>

              <div className="relative">
                <CalendarMonthIcon className="!pointer-events-none !absolute !left-3 !top-1/2 !-translate-y-1/2 !text-xl !text-slate-400" />

                <select
                  value={assessmentYear}
                  onChange={handleAssessmentYearChange}
                  className="h-11 w-full appearance-none rounded-md border border-slate-300 bg-white pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Assessment Years</option>

                 {(allFinancialYears || []).map((year) => (
  <option key={year} value={year}>
    {year}
  </option>
))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= OFFICER DIRECTORY ================= */}

        <section className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Officer Directory
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  View and manage available officer records.
                </p>
              </div>

              <div className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs text-slate-500">Records Shown</span>
                <span className="ml-2 text-sm font-bold text-slate-900">
                  {displayedEmployees.length}
                </span>
              </div>
            </div>
          </div>

          {displayedEmployees.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <BadgeIcon className="!text-3xl !text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No Officer Records Found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                No officer matches the selected search or assessment year.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className=" md:block">
                <table className="w-full min-w-[920px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#0b3a6f] text-white">
                      <th className="w-16 border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        #
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Officer Code
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Email
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Designation
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Category
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Financial Year
                      </th>

                      <th className="w-24 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedEmployees.map((emp, index) => (
                      <tr
                        key={emp._id}
                        className="border-b border-slate-200 odd:bg-white even:bg-slate-50 transition hover:bg-blue-50"
                      >
                        <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-700">
                          {(page - 1) * limit + index + 1}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3">
                          <span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
                            {emp.code || emp.employeeCode || "-"}
                          </span>
                        </td>

                        <td className="max-w-[260px] border-r border-slate-200 px-4 py-3">
                          <span className="block truncate font-medium text-slate-700">
                            {emp.email || "-"}
                          </span>
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
  {emp.designations?.[0]?.name || "-"}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3">
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            {emp.category?.name || "-"}
                          </span>
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3">
                          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                            {emp.currentFinancialYear || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <ActionDropdown
                                            onUpdate={() => handleUpdate(emp)}
                                            onView={() => handleView(emp)}
                                            onDelete={() => handleDelete(emp)}
                                        />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="grid gap-3 p-3 md:hidden">
                {displayedEmployees.map((emp, index) => (
                  <article
                    key={emp._id}
                    className="overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Officer #{(page - 1) * limit + index + 1}
                        </p>

                        <h3 className="mt-1 break-words text-sm font-bold text-slate-900">
                          {emp.code || emp.employeeCode || "No Officer Code"}
                        </h3>
                      </div>

                      <div className="shrink-0 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                        <ActionDropdown
                          onView={() => handleView(emp)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 p-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-slate-800">
                          {emp.email || "-"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Designation
                          </p>

                          <p className="mt-1 break-words text-sm font-medium text-slate-800">
                            {emp.designation?.name || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Category
                          </p>

                          <p className="mt-1 break-words text-sm font-medium text-slate-800">
                            {emp.category?.name || "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Financial Year
                        </p>

                        <p className="mt-1 text-sm font-bold text-amber-800">
                          {emp.currentFinancialYear || "-"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* PAGINATION */}

          {displayedEmployees.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-3 py-4 sm:px-5">
              <div className="flex justify-center">
                <div className="max-w-full overflow-x-auto rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <UIPagination
                    totalPages={totalPages}
                    page={page}
                    onChange={(newPage) => setPage(newPage)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Officer Management • Official Human Resource Administration Portal
        </footer>
      </div>
    </div>
  );
}