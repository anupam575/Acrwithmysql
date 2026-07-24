"use client";

import React, { useEffect, useMemo, useState } from "react";
import API from "../../../utils/axiosInstance";
import SupervisorApprisal from "../components/Supervisorapprisal";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

const VIEW = {
  DROPDOWN: "DROPDOWN",
  FORM: "FORM",
};

export default function ReportingOfficerDropdown() {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [view, setView] = useState(VIEW.DROPDOWN);

  useEffect(() => {
    fetchReportingOfficers();
  }, []);

  const fetchReportingOfficers = async () => {
    try {
      const { data } = await API.get("/self-appraisal/reporting-officers");

      console.log("📥 Officers API Response:", data);

      if (data.success) {
        setOfficers(data.data);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    }
  };

  const handleSelect = (officerId) => {
    const officer = officers.find((o) => o._id === officerId);

    console.log("🔍 Selected Officer Full Object:", officer);

    if (!officer) return;

    setSelectedOfficer(officer);
    setView(VIEW.FORM);
  };

  const handleBack = () => {
    setSelectedOfficer(null);
    setView(VIEW.DROPDOWN);
  };

  const officerCount = useMemo(() => officers.length, [officers]);

  return (
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* PAGE HEADER */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Annual Performance Appraisal Report
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Reporting Officer Selection
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Select the appropriate reporting officer to continue with the
                  appraisal submission and review process.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Available Officers
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {officerCount}
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Current Step
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {view === VIEW.DROPDOWN
                      ? "Officer Selection"
                      : "Appraisal Form"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
            <span>Home</span>
            <span>/</span>
            <span>APAR Management</span>
            <span>/</span>
            <span className="font-semibold text-[#0b4a7f]">
              {view === VIEW.DROPDOWN
                ? "Reporting Officer Selection"
                : "Supervisor Appraisal"}
            </span>
          </div>
        </section>

        {/* PROGRESS STEPS */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <StepCard
              step="01"
              title="Select Reporting Officer"
              description="Choose the officer responsible for reviewing the appraisal."
              active={view === VIEW.DROPDOWN}
              completed={view === VIEW.FORM}
            />

            <StepCard
              step="02"
              title="Complete Appraisal Form"
              description="Review the selected officer and complete the appraisal."
              active={view === VIEW.FORM}
              completed={false}
            />
          </div>
        </section>

        {/* DROPDOWN VIEW */}
        {view === VIEW.DROPDOWN && (
          <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                    Select Reporting Officer
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose one reporting officer from the available list.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <label
                htmlFor="reporting-officer"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
              >
                Reporting Officer
              </label>

              <div className="relative">
                <select
                  id="reporting-officer"
                  value={selectedOfficer?._id || ""}
                  onChange={(e) => handleSelect(e.target.value)}
                  className="min-h-12 w-full appearance-none rounded-md border border-slate-300 bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0b4a7f] focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Reporting Officer</option>

                  {officers.map((officer) => (
                    <option key={officer._id} value={officer._id}>
                      {officer.name}
                      {officer.department
                        ? ` (${officer.department})`
                        : ""}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <InfoPanel
                  icon={<Info size={20} />}
                  title="Selection Guidance"
                  description="The selected officer will review and approve the appraisal submission."
                />

                <InfoPanel
                  icon={<ShieldCheck size={20} />}
                  title="Secure Verification"
                  description="Officer information is loaded directly from the appraisal system."
                />
              </div>

              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Users
                    size={20}
                    className="mt-0.5 shrink-0 text-[#0b4a7f]"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Officer Availability
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {officerCount > 0
                        ? `${officerCount} reporting officer${
                            officerCount > 1 ? "s are" : " is"
                          } currently available for selection.`
                        : "No reporting officers are currently available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FORM VIEW */}
        {view === VIEW.FORM && (
          <div className="space-y-5">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <UserCheck size={22} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Selected Reporting Officer
                      </p>

                      <h2 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                        {selectedOfficer?.name || "N/A"}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Review the selected officer details before completing
                        the appraisal.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleBack}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#0b4a7f] sm:w-fit"
                  >
                    <ArrowLeft size={17} />
                    Change Officer
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
                <DetailCard
                  icon={<UserCheck size={18} />}
                  label="Officer Name"
                  value={selectedOfficer?.name}
                />

                <DetailCard
                  icon={<Building2 size={18} />}
                  label="Department"
                  value={selectedOfficer?.department}
                />

                <DetailCard
                  icon={<ShieldCheck size={18} />}
                  label="Selection Status"
                  value="Verified and Selected"
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-[#0b4a7f] px-4 py-4 text-white sm:px-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} />

                  <div>
                    <h2 className="text-sm font-bold sm:text-base">
                      Supervisor Appraisal Form
                    </h2>

                    <p className="mt-1 text-xs text-blue-100">
                      Complete the appraisal details for the selected reporting
                      officer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-hidden p-3 sm:p-5">
                <SupervisorApprisal
                  reportingOfficerId={selectedOfficer?._id}
                  departmentId={selectedOfficer?.departmentId || null}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ step, title, description, active, completed }) {
  return (
    <div
      className={`rounded-lg border p-4 transition ${
        active
          ? "border-[#0b4a7f] bg-blue-50"
          : completed
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
            active
              ? "bg-[#0b4a7f] text-white"
              : completed
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-600"
          }`}
        >
          {completed ? <CheckCircle2 size={18} /> : step}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ icon, title, description }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[#0b4a7f]">{icon}</div>

        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-900">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}