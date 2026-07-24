import React from "react";
import useEmployeeDetails from "./useEmployeeDetails";
import useActiveTab from "./useActiveTab";
const InfoCard = ({ title, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="font-semibold text-gray-900 mt-2 break-words">
        {value || "-"}
      </p>
    </div>
  );
};
export default function EmployeeDetailsView({ employeeId }) {
  const { employeeData, loading, error } = useEmployeeDetails(employeeId);
  const { activeTab, setActiveTab } = useActiveTab(0);

  if (loading) {
    return <div className="p-10 text-center animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!employeeData?.length) {
    return <div className="p-10 text-center">No Data Found</div>;
  }

  const activeData = employeeData[activeTab]; // ⭐ MAIN LOGIC

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-10">
        {/* ================= TABS ================= */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
  {employeeData?.map((item, index) => (
    <button
      key={item?._id || index}
      onClick={() => setActiveTab(index)}
      className={`min-w-[250px] rounded-2xl p-5 border transition-all duration-300 ${
        activeTab === index
          ? "bg-gradient-to-br from-slate-900 to-slate-700 text-white border-transparent shadow-xl scale-105"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
  

  <p
    className={`text-sm mt-1 ${
      activeTab === index
        ? "text-gray-300"
        : "text-gray-500"
    }`}
  >
    Reporting Officer
  </p>
  <h3 className="font-bold text-base">
    {item?.reportingOfficerId?.firstName},{" "}
    {item?.department?.department_name}
  </h3>
</div>

        <div
          className={`h-3 w-3 rounded-full ${
            activeTab === index
              ? "bg-emerald-400"
              : "bg-gray-300"
          }`}
        />
      </div>

     
    </button>
  ))}
</div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
            <h2 className="text-3xl font-bold">
              {activeData?.reportingOfficerId?.firstName}
            </h2>

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-white/20 px-4 py-1 rounded-full">
                {activeData?.department?.department_name}
              </span>

              <span className="bg-white/20 px-4 py-1 rounded-full">
                {activeData?.category?.name}
              </span>

              <span className="bg-white/20 px-4 py-1 rounded-full">
                FY {activeData?.currentFinancialYear}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* KPI CARDS */}
            <div className="grid md:grid-cols-4 gap-5">
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

            {/* RESPONSIBILITIES */}
            <div>
              <h3 className="font-bold text-xl mb-4">Responsibilities</h3>

              <div className="bg-gray-50 p-5 rounded-xl">
                {activeData?.responsibilities}
              </div>
            </div>

            {/* MOU DETAILS */}
            <div>
              <h3 className="font-bold text-xl mb-4">MOU Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard
                  title="Deliverables"
                  value={activeData?.mouDeliverables}
                />

                <InfoCard
                  title="Achievement"
                  value={activeData?.mouAchievement}
                />
              </div>
            </div>

            {/* TASKS */}
            <div>
              <h3 className="font-bold text-xl mb-4">Assigned Tasks</h3>

              <div className="space-y-4">
                {activeData?.tasks?.map((task, index) => (
                  <div
                    key={task._id}
                    className="border rounded-2xl p-5 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">
                        Task {index + 1}
                      </h4>

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {task.weightage}%
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <InfoCard title="Task Name" value={task.taskName} />

                      <InfoCard
                        title="Deliverables"
                        value={task.deliverables}
                      />

                      <InfoCard title="Achievement" value={task.achievement} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTRIBUTIONS */}
            <div className="grid md:grid-cols-2 gap-5">
              <InfoCard
                title="Exceptional Contribution"
                value={activeData?.exceptionalContribution}
              />

              <InfoCard title="Constraints" value={activeData?.constraints} />
            </div>

            {/* TRAINING */}
            <div>
              <h3 className="font-bold text-xl mb-4">Training Requirements</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard
                  title="Current Assignment Training"
                  value={activeData?.currentAssignmentTraining}
                />

                <InfoCard
                  title="Future Career Training"
                  value={activeData?.futureCareerTraining}
                />
              </div>
            </div>


<div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
  <label className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
    Reporting Officer Signature
  </label>

  <div className="flex h-44 w-80 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
    {activeData?.officerSignature?.url ? (
      <img
        src={`http://localhost:4000${activeData.officerSignature.url}`}
        alt="Reporting Officer Signature"
        className="max-h-36 max-w-full object-contain"
      />
    ) : (
      <p className="text-gray-400">No Signature</p>
    )}
  </div>
</div>
            {/* COMPLIANCE */}
            <div>
              <h3 className="font-bold text-xl mb-4">Compliance Status</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-medium">Medical Checkup</p>
                  <p>
                    {activeData?.medicalCheckupDone ? "✅ Done" : "❌ Pending"}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-medium">Annual Work Plan</p>
                  <p>
                    {activeData?.annualWorkPlanSetForOfficers
                      ? "✅ Completed"
                      : "❌ Pending"}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-medium">Immovable Property Return</p>
                  <p>
                    {activeData?.immovablePropertyReturnFiled
                      ? "✅ Filed"
                      : "❌ Not Filed"}
                  </p>
                </div>
              </div>
            </div>

            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-4">
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
                value={new Date(activeData?.createdAt).toLocaleDateString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
