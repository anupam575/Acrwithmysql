"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./components/Dashboard";
import { fetchUser } from "../../redux/slices/authslice";

export default function Employee() {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) {
      dispatch(fetchUser());
    }
  }, [dispatch, user?._id]);

  if (loading || !user?._id) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="border-b border-blue-900/20 bg-[#0b4a7f]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-3">
              <div className="h-3 w-48 animate-pulse rounded bg-white/20" />
              <div className="h-8 w-80 max-w-full animate-pulse rounded bg-white/20" />
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-8" />
            <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* PAGE HERO */}
      <section className="mx-4 mt-4 rounded-xl   border-b border-blue-900/20 bg-[#0b4a7f] text-white sm:mx-6 lg:mx-8">
        <div className="mx-auto  px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200"
              >
                <span>Home</span>
                <span aria-hidden="true">/</span>
                <span>Employee Services</span>
                <span aria-hidden="true">/</span>
                <span className="text-white">Dashboard</span>
              </nav>

              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Employee Performance Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
                Review appraisal progress, assigned goals, performance history,
                recent workflow activities, and official announcements.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <HeroStatus label="User Module" value="Employee Portal" />
              <HeroStatus label="System Status" value="Operational" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* EMPLOYEE PROFILE DASHBOARD */}
        <section aria-label="Employee profile dashboard">
          <Dashboard userId={user._id} />
        </section>

        {/* KPI SECTION */}
        <section aria-labelledby="employee-kpi-title">
          <SectionHeader
            eyebrow="Performance Summary"
            title="Employee Appraisal Indicators"
            description="Current appraisal and performance indicators for the active assessment cycle."
            id="employee-kpi-title"
          />

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Appraisal Progress"
              value="82%"
              status="In Progress"
              tone="blue"
              icon="AP"
            />

            <KpiCard
              label="Goals Completed"
              value="14"
              status="Completed"
              tone="emerald"
              icon="GC"
            />

            <KpiCard
              label="Pending Reviews"
              value="2"
              status="Action Required"
              tone="amber"
              icon="PR"
            />

            <KpiCard
              label="Performance Score"
              value="4.8"
              status="Current Rating"
              tone="violet"
              icon="PS"
            />
          </div>
        </section>

        {/* ANALYTICS AND ACTIONS */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* PERFORMANCE ANALYTICS */}
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-8">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                    Performance Analytics
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Performance Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track performance patterns across the latest assessment
                    period.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  Last 6 Months
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricInfo label="Assessment Scope" value="Individual" />
                <MetricInfo label="Reporting Period" value="6 Months" />
                <MetricInfo label="Data Status" value="Updated" />
              </div>

              <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-sm font-extrabold text-[#0b4a7f]">
                    KPI
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    Performance Chart
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Chart Component Here
                  </p>

                  <span className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Visualization Area
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-500">
                  Employee performance monitoring panel
                </p>

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              </div>
            </div>
          </article>

          {/* QUICK ACTIONS */}
          <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-4">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                Employee Services
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access frequently used appraisal functions.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <ActionButton
                sequence="01"
                label="Self Assessment"
                description="Submit appraisal inputs"
                tone="blue"
              />

              <ActionButton
                sequence="02"
                label="View Goals"
                description="Review assigned goals"
                tone="indigo"
              />

              <ActionButton
                sequence="03"
                label="Performance History"
                description="Check previous records"
                tone="emerald"
              />

              <ActionButton
                sequence="04"
                label="Download Reports"
                description="Export appraisal reports"
                tone="violet"
              />
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs font-medium text-slate-500">
                Select an action to continue
              </p>
            </div>
          </aside>
        </section>

        {/* ACTIVITIES AND ANNOUNCEMENTS */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ACTIVITIES */}
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                Activity Timeline
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Recent Activities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest updates from your appraisal workflow.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <ActivityItem
                index="01"
                text="Self assessment submitted successfully."
                status="Completed"
              />

              <ActivityItem
                index="02"
                text="Manager review started."
                status="In Progress"
              />

              <ActivityItem
                index="03"
                text="Goal completion updated."
                status="Updated"
              />
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs font-medium text-slate-500">
                Latest employee workflow activities
              </p>
            </div>
          </article>

          {/* ANNOUNCEMENTS */}
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                Official Updates
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Announcements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Important notices related to employee appraisal activities.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <AnnouncementItem
                label="Appraisal Update"
                text="Q4 appraisal process is now active."
                tone="blue"
              />

              <AnnouncementItem
                label="Meeting Notice"
                text="Goal review meeting next week."
                tone="indigo"
              />
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs font-medium text-slate-500">
                Important employee notifications
              </p>
            </div>
          </article>
        </section>

        {/* PAGE FOOTER STATUS */}
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
                Portal Information
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Employee appraisal dashboard is available and operational.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                Secure Session Active
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStatus({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm sm:min-w-[145px]">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-200">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, id }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
        {eyebrow}
      </p>

      <h2 id={id} className="mt-1 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function KpiCard({ label, value, status, tone, icon }) {
  const tones = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      text: "text-blue-800",
      dot: "bg-blue-500",
    },
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    violet: {
      border: "border-violet-200",
      bg: "bg-violet-50",
      text: "text-violet-800",
      dot: "bg-violet-500",
    },
  };

  const current = tones[tone];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className="h-1 bg-[#0b4a7f]" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </p>

            <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              {value}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[10px] font-extrabold ${current.border} ${current.bg} ${current.text}`}
          >
            {icon}
          </div>
        </div>

        <div
          className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 ${current.border} ${current.bg}`}
        >
          <span className={`h-2 w-2 rounded-full ${current.dot}`} />

          <span
            className={`text-[10px] font-bold uppercase tracking-wide ${current.text}`}
          >
            {status}
          </span>
        </div>
      </div>
    </article>
  );
}

function MetricInfo({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ActionButton({ sequence, label, description, tone }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
    indigo:
      "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
    emerald:
      "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    violet:
      "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100",
  };

  return (
    <button
      type="button"
      className={`group flex w-full items-center gap-3 rounded-lg border p-4 text-left transition ${tones[tone]}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-current/15 bg-white/70 text-[10px] font-extrabold">
        {sequence}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">
          {label}
        </span>

        <span className="mt-1 block text-xs opacity-75">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="text-base font-bold transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

function ActivityItem({ index, text, status }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[10px] font-bold text-[#0b4a7f]">
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-5 text-slate-700">
          {text}
        </p>

        <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {status}
        </p>
      </div>
    </div>
  );
}

function AnnouncementItem({ label, text, tone }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-900",
  };

  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-[9px] font-bold uppercase tracking-wide opacity-70">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-5">
        {text}
      </p>
    </div>
  );
}
