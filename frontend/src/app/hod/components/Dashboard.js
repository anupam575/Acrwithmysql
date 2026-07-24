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
      <div className="p-6">
        <div className="h-[320px] rounded-[32px] bg-slate-200 animate-pulse"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-red-500">
          No employee data found
        </div>
      </div>
    );
  }

  const officerName =
    employee?.officerName ||
    employee?.employee_name ||
    "Officer";
return (
  <div className="">

    <div
      className="
      relative
      overflow-hidden
      rounded-[28px]
      bg-gradient-to-br
      from-[#1e3a8a]
      to-[#2563eb]
      text-white
      shadow-[0_20px_60px_rgba(0,0,0,0.35)]
      "
    >

      {/* Glow */}
      <div className="absolute top-0 right-0 h-56 w-56 bg-cyan-400/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-56 w-56 bg-indigo-500/20 blur-[100px]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:35px_35px]" />

      <div className="relative px-6 py-5 lg:px-8 lg:py-6">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex-1">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-100">
                Appraisal Cycle Active
              </span>
            </div>

            <p className="text-blue-100 text-sm mb-1">
              Welcome Back
            </p>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {officerName}
            </h1>

            <p className="mt-2 text-sm text-blue-100 max-w-xl leading-6">
              Your performance appraisal workflow is currently
              under management review. Track progress and
              complete pending activities.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <button className="rounded-xl bg-white text-blue-700 px-5 py-2.5 text-sm font-semibold hover:scale-105 transition">
                Continue Assessment
              </button>

              <button className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl hover:bg-white/10 transition">
                View Progress
              </button>

            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="w-full lg:w-[320px]">

            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-4">

              <div className="flex items-center gap-3">

                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg">
                  {officerName?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {employee?.designation?.name || "Employee"}
                  </h3>

                  <p className="text-xs text-blue-100">
                    {employee?.reportingDepartments?.[0]?.department_name ||
                      "Department"}
                  </p>
                </div>

              </div>

              <div className="my-4 border-t border-white/10" />

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-blue-100">
                    Manager
                  </span>
                  <span className="font-medium">
                    {reporting?.firstName ||
                      reporting?.name ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-100">
                    Employee Code
                  </span>
                  <span className="font-medium">
                    {employee?.employeeCode || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-100">
                    Department
                  </span>
                  <span className="font-medium">
                    {employee?.reportingDepartments?.[0]
                      ?.department_name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-100">
                    Status
                  </span>
                  <span className="font-semibold text-emerald-300">
                    Active
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}