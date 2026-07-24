import React from "react";
import useEmployeeDetails from "./useEmployeeDetails";
import useActiveTab from "./useActiveTab";

const InfoCard = ({ title, value }) => {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {title}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-3 flex items-start gap-3 border-b border-slate-200 pb-3">
    <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />

    <div>
      <h3 className="text-sm font-bold text-slate-900 sm:text-[15px]">
        {title}
      </h3>

      {subtitle && (
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
      )}
    </div>
  </div>
);

const ComplianceCard = ({ title, completed, completedText, pendingText }) => (
  <div
    className={`rounded-md border p-3 ${
      completed
        ? "border-emerald-200 bg-emerald-50"
        : "border-amber-200 bg-amber-50"
    }`}
  >
    <p className="text-xs font-bold text-slate-800">{title}</p>

    <p
      className={`mt-1 text-sm font-semibold ${
        completed ? "text-emerald-700" : "text-amber-700"
      }`}
    >
      {completed ? completedText : pendingText}
    </p>
  </div>
);

export default function EmployeeDetailsViewing({ employeeId }) {
  const { employeeData, loading, error } = useEmployeeDetails(employeeId);
  const { activeTab, setActiveTab } = useActiveTab(0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Assessment Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while employee assessment records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-lg font-bold text-red-700">
              !
            </div>

            <h2 className="mt-4 text-base font-bold text-red-700">
              Unable to Load Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
              —
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-900">
              No Assessment Data Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No employee assessment records are currently available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeData = employeeData[activeTab]; // ⭐ MAIN LOGIC

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Performance Appraisal Management
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Employee Assessment Details
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review reporting-officer-wise responsibilities, assigned tasks,
                  achievements, training requirements, and compliance details.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                {employeeData.length} Record
                {employeeData.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Employee Assessment</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">View Details</span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Reporting Officer Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a record to view its complete assessment details.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {employeeData?.map((item, index) => (
              <button
                key={item?._id || index}
                onClick={() => setActiveTab(index)}
                className={`min-w-[235px] rounded-md border p-3 text-left transition ${
                  activeTab === index
                    ? "border-blue-800 bg-blue-800 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                        activeTab === index
                          ? "text-blue-200"
                          : "text-slate-500"
                      }`}
                    >
                      Reporting Officer
                    </p>

                    <h3 className="mt-1 break-words text-sm font-bold leading-5">
                      {item?.reportingOfficerId?.firstName || "-"}
                    </h3>

                    <p
                      className={`mt-1 break-words text-xs ${
                        activeTab === index
                          ? "text-blue-100"
                          : "text-slate-500"
                      }`}
                    >
                      {item?.department?.department_name || "-"}
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      activeTab === index ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Active Assessment Record
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {activeData?.reportingOfficerId?.firstName || "-"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold">
                  {activeData?.department?.department_name || "-"}
                </span>

                <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold">
                  {activeData?.category?.name || "-"}
                </span>

                <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold">
                  FY {activeData?.currentFinancialYear || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                title="MOU Weightage"
                value={activeData?.mouWeightage}
              />

              <InfoCard
                title="Task Weightage"
                value={activeData?.calculatedTotalTaskWeightage}
              />

              <InfoCard
                title="Total Weightage"
                value={activeData?.totalTaskWeightage}
              />

              <InfoCard
                title="Grand Total"
                value={activeData?.calculatedGrandTotal}
              />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <SectionHeader
                title="Responsibilities"
                subtitle="Key duties assigned during the appraisal period"
              />

              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800">
                {activeData?.responsibilities || "-"}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <SectionHeader
                title="MOU Details"
                subtitle="Deliverables and achievement recorded against MOU targets"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoCard
                  title="Deliverables"
                  value={activeData?.mouDeliverables}
                />

                <InfoCard
                  title="Achievement"
                  value={activeData?.mouAchievement}
                />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <SectionHeader
                title="Assigned Tasks"
                subtitle="Task-wise deliverables, achievements, and approved weightage"
              />

              {activeData?.tasks?.length ? (
                <div className="space-y-3">
                  {activeData.tasks.map((task, index) => (
                    <div
                      key={task._id || index}
                      className="overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5">
                        <h4 className="text-sm font-bold text-slate-900">
                          Task {index + 1}
                        </h4>

                        <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                          {task.weightage || 0}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
                        <InfoCard title="Task Name" value={task.taskName} />

                        <InfoCard
                          title="Deliverables"
                          value={task.deliverables}
                        />

                        <InfoCard
                          title="Achievement"
                          value={task.achievement}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-400">
                  No Tasks Found
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <SectionHeader
                  title="Contribution and Constraints"
                  subtitle="Exceptional contribution and performance constraints"
                />

                <div className="grid grid-cols-1 gap-3">
                  <InfoCard
                    title="Exceptional Contribution"
                    value={activeData?.exceptionalContribution}
                  />

                  <InfoCard
                    title="Constraints"
                    value={activeData?.constraints}
                  />
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <SectionHeader
                  title="Training Requirements"
                  subtitle="Current assignment and future career training needs"
                />

                <div className="grid grid-cols-1 gap-3">
                  <InfoCard
                    title="Current Assignment Training"
                    value={activeData?.currentAssignmentTraining}
                  />

                  <InfoCard
                    title="Future Career Training"
                    value={activeData?.futureCareerTraining}
                  />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <SectionHeader
                  title="Compliance Status"
                  subtitle="Mandatory compliance and declaration status"
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <ComplianceCard
                    title="Medical Checkup"
                    completed={activeData?.medicalCheckupDone}
                    completedText="Completed"
                    pendingText="Pending"
                  />

                  <ComplianceCard
                    title="Annual Work Plan"
                    completed={activeData?.annualWorkPlanSetForOfficers}
                    completedText="Completed"
                    pendingText="Pending"
                  />

                  <ComplianceCard
                    title="Immovable Property Return"
                    completed={activeData?.immovablePropertyReturnFiled}
                    completedText="Filed"
                    pendingText="Not Filed"
                  />
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <SectionHeader
                  title="Reporting Officer Signature"
                  subtitle="Digitally uploaded signature"
                />

                <div className="flex min-h-28 items-center justify-center rounded-md border border-slate-300 bg-slate-50 p-3">
                  {activeData?.officerSignature?.url ? (
                    <img
                      src={`http://localhost:4000${activeData.officerSignature.url}`}
                      alt="Reporting Officer Signature"
                      className="max-h-24 max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-400">
                      No Signature
                    </p>
                  )}
                </div>
              </section>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <SectionHeader
                title="Record Information"
                subtitle="Filing and system record dates"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoCard
                  title="IPR Filing Date"
                  value={
                    activeData?.immovablePropertyReturnDate
                      ? new Date(
                          activeData.immovablePropertyReturnDate,
                        ).toLocaleDateString()
                      : "-"
                  }
                />

                <InfoCard
                  title="Created At"
                  value={
                    activeData?.createdAt
                      ? new Date(activeData.createdAt).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
            </section>
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Employee Assessment Record • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
}