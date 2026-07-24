"use client";

import {
  AdminPanelSettings,
  Apartment,
  Assessment,
  CheckCircle,
  Dashboard,
  Groups,
  Insights,
  ManageAccounts,
  MonitorHeart,
  Security,
  Settings,
  TrendingUp,
} from "@mui/icons-material";

import DashboardPage from "../components/section/admincard";
import EmployeeDashboardCard from "../components/section/employeecard";
import DepartmentDashboardCard from "../components/section/departmentcard";

export default function AdminPage() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* GOVERNMENT PORTAL HERO */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100 sm:text-xs">
                  Administrative Control Centre
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Admin Dashboard
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Monitor users, employees, departments, appraisal activity,
                  and overall system operations from one consolidated workspace.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <HeroMetric
                  label="System Status"
                  value="Operational"
                  icon={<CheckCircle fontSize="small" />}
                />

                <HeroMetric
                  label="Report Date"
                  value={currentDate}
                  icon={<Assessment fontSize="small" />}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Administration</span>
            <span>/</span>
            <span className="font-semibold text-[#0b4a7f]">
              Dashboard
            </span>
          </div>
        </section>

        {/* ADMINISTRATION SUMMARY */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<ManageAccounts fontSize="small" />}
            label="User Administration"
            value="Manage Access"
            description="User accounts and roles"
          />

          <InfoCard
            icon={<Groups fontSize="small" />}
            label="Employee Records"
            value="Centralized"
            description="Employee information"
          />

          <InfoCard
            icon={<Apartment fontSize="small" />}
            label="Departments"
            value="Organized"
            description="Department structure"
          />

          <InfoCard
            icon={<Security fontSize="small" />}
            label="Portal Security"
            value="Protected"
            description="Secure system access"
          />
        </section>

        {/* PRIMARY DASHBOARD CARDS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={<Dashboard fontSize="small" />}
            title="Administrative Overview"
            description="Live summary of users, employees, and departments."
          />

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 sm:p-6 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-4">
              <DashboardPage />
            </div>

            <div className="min-w-0 xl:col-span-4">
              <EmployeeDashboardCard />
            </div>

            <div className="min-w-0 md:col-span-2 xl:col-span-4">
              <DepartmentDashboardCard />
            </div>
          </div>
        </section>

        {/* LOWER DASHBOARD */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* ANALYTICS */}
          <div className="xl:col-span-8">
            <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<Insights fontSize="small" />}
                title="Dashboard Analytics"
                description="Administrative performance and system activity overview."
              />

              <div className="p-4 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <AnalyticsMetric
                    label="User Activity"
                    value="Live"
                    icon={<TrendingUp fontSize="small" />}
                  />

                  <AnalyticsMetric
                    label="Data Monitoring"
                    value="Active"
                    icon={<MonitorHeart fontSize="small" />}
                  />

                  <AnalyticsMetric
                    label="System Insights"
                    value="Available"
                    icon={<Assessment fontSize="small" />}
                  />
                </div>

                <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#0b4a7f]">
                      <Insights sx={{ fontSize: 32 }} />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      Analytics and Charts Section
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      System performance, department distribution, employee
                      statistics, and appraisal workflow charts can be rendered
                      in this area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-4">
            <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<AdminPanelSettings fontSize="small" />}
                title="Administrative Summary"
                description="Key portal functions and monitoring status."
              />

              <div className="space-y-3 p-4 sm:p-6">
                <SummaryCard
                  label="Active Users"
                  description="Review registered portal users"
                  icon={<Groups fontSize="small" />}
                />

                <SummaryCard
                  label="Employee Records"
                  description="Maintain employee master data"
                  icon={<ManageAccounts fontSize="small" />}
                />

                <SummaryCard
                  label="Department Management"
                  description="Manage organizational departments"
                  icon={<Apartment fontSize="small" />}
                />

                <SummaryCard
                  label="System Monitoring"
                  description="Review portal health and activity"
                  icon={<Settings fontSize="small" />}
                />
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle fontSize="small" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      All Systems Operational
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Core administrative services are available and running
                      normally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, icon }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
      <div className="flex items-center gap-2 text-blue-100">
        {icon}
        <p className="text-[9px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ icon, label, value, description }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function AnalyticsMetric({ label, value, icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, description, icon }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#0b4a7f] shadow-sm ring-1 ring-slate-200 transition group-hover:ring-blue-200">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}