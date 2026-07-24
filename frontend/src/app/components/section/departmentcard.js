"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import API from "../../../utils/axiosInstance";

export default function DepartmentDashboardCard() {
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const fetchDepartmentStats = async () => {
    try {
      const res = await API.get("/departments/department/count");

      if (res.data.success) {
        setTotalDepartments(res.data.totalDepartments);
      }
    } catch (error) {
      console.error("Department Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-blue-300 hover:shadow-md">
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-[#0b4a7f]" />

      <div className="p-5 sm:p-6">
        {/* CARD HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
                <Layers3 size={18} />
              </span>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Department Administration
              </p>
            </div>

            <h2 className="mt-4 text-sm font-bold text-slate-900">
              Total Departments
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Registered organizational departments in the system.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#0b4a7f]">
            <Building2 size={24} />
          </div>
        </div>

        {/* PRIMARY VALUE */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Active Department Units
          </p>

          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              {loading ? (
                <div className="flex items-center gap-3">
                  <RefreshCw
                    size={24}
                    className="animate-spin text-[#0b4a7f]"
                  />

                  <span className="text-sm font-semibold text-slate-500">
                    Loading records...
                  </span>
                </div>
              ) : (
                <p className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  {totalDepartments}
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              <BadgeCheck size={13} />
              Live Data
            </span>
          </div>
        </div>

        {/* STATUS AREA */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <StatusItem
            icon={<Workflow size={17} />}
            label="Department Status"
            value="Active"
          />

          <StatusItem
            icon={<ShieldCheck size={17} />}
            label="Data Source"
            value="Verified"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-slate-500">
            Department master statistics
          </p>

          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>
      </div>
    </article>
  );
}

function StatusItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}