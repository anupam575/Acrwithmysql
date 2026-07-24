"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function Dashboard({ userId }) {
  const [employee, setEmployee] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async () => {
    try {
      if (!userId) return;

      setLoading(true);

      const res = await API.get(`/employees/full/${userId}`);
      const data = res?.data?.data;

      setEmployee(data);

      if (data?.reportingUsers?.length > 0) {
        setReporting(
          data.reportingUsers[data.reportingUsers.length - 1]
        );
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchEmployee();
  }, [userId]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-[#0b4a7f]" />

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-64 max-w-full animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-8 w-32 animate-pulse rounded-full bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-72 max-w-full animate-pulse rounded bg-slate-200" />
              <div className="h-16 w-full max-w-2xl animate-pulse rounded bg-slate-100" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            </div>

            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="h-1 bg-red-600" />

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-lg font-bold text-red-600">
            !
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
              Employee Record
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              No employee data found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Employee information is currently unavailable for this account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const officerName =
    employee?.officerName ||
    employee?.employee_name ||
    "Officer";

  const designation =
    employee?.designation?.name || "Employee";

  const department =
    employee?.reportingDepartments?.[0]?.department_name ||
    "Department";

  const managerName =
    reporting?.firstName ||
    reporting?.name ||
    "N/A";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* GOVERNMENT ACCENT */}
      <div className="h-1 bg-[#0b4a7f]" />

      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
              Employee Appraisal Portal
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Employee Profile and Assessment Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View current appraisal-cycle progress and official employee details.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Appraisal Cycle Active
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        {/* WELCOME AREA */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0b4a7f]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b4a7f]">
              Employee Dashboard
            </span>
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-500">
            Welcome Back
          </p>

          <h1 className="mt-1 break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {officerName}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your performance appraisal workflow is currently under management
            review. Track progress and complete pending activities.
          </p>

          {/* ASSESSMENT SUMMARY */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryItem
              label="Current Stage"
              value="Management Review"
            />

            <SummaryItem
              label="Assessment Cycle"
              value="Active"
            />

            <SummaryItem
              label="Profile Status"
              value="Verified"
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0b4a7f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083a64] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            >
              Continue Assessment
            </button>

            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#0b4a7f] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
            >
              View Progress
            </button>
          </div>
        </div>

        {/* EMPLOYEE DETAILS */}
        <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="bg-[#0b4a7f] px-4 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-lg font-bold">
                {officerName?.charAt(0)?.toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {designation}
                </p>

                <p className="mt-1 truncate text-xs text-blue-100">
                  {department}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
              Official Information
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            <DetailRow
              label="Manager"
              value={managerName}
            />

            <DetailRow
              label="Employee Code"
              value={employee?.employeeCode || "N/A"}
            />

            <DetailRow
              label="Department"
              value={
                employee?.reportingDepartments?.[0]
                  ?.department_name || "N/A"
              }
            />

            <DetailRow
              label="Designation"
              value={designation}
            />

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="shrink-0 text-xs font-semibold text-slate-500">
                Status
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Employee appraisal and reporting information
          </span>

          <span className="font-semibold text-[#0b4a7f]">
            Secure Session Active
          </span>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="shrink-0 text-xs font-semibold text-slate-500">
        {label}
      </span>

      <span className="min-w-0 break-words text-right text-xs font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}