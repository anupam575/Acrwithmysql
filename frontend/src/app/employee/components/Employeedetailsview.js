
"use client"
import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";


function useEmployeeDetails(employeeId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    let isMounted = true;

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🚀 Fetching Employee Details for ID:", employeeId);

        const response = await API.get(
          `/self-appraisal/view/${employeeId}`
        );

        console.log("✅ API RESPONSE:", response?.data);

        if (isMounted) {
          setEmployeeData(response?.data?.data || null);
        }
      } catch (err) {
        console.error("❌ API ERROR:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Failed to fetch employee details"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEmployeeDetails();

    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  return { employeeData, loading, error };
}
 

export default function EmployeeDetailsView({ employeeId }) {
  const { employeeData, loading, error } =
    useEmployeeDetails(employeeId);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

            <div>
              <h2 className="font-semibold text-lg">Loading Employee Data</h2>

              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR (UNCHANGED UI)
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl mb-5">
            !
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // =========================
  // NO DATA (UNCHANGED UI)
  // =========================
  if (!employeeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-900">
            No Employee Data Found
          </h2>

          <p className="text-gray-500 mt-2">
            Employee details are not available.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-gray-300 text-sm uppercase tracking-widest">
                Section II – Self-appraisal of the officer reported upon
              </p>

              <h1 className="text-white text-3xl font-bold mt-3">
                Employee Appraisal Details
              </h1>

              <p className="text-gray-400 mt-2">
                Detailed employee appraisal information and reporting
                assessment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
                <p className="text-xs text-gray-300">Financial Year</p>

                <p className="text-white font-semibold mt-1">
                  {employeeData?.currentFinancialYear || "N/A"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
                <p className="text-xs text-gray-300">Grand Total</p>

                <p className="text-white font-semibold mt-1">
                  {employeeData?.calculatedGrandTotal || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VALIDATION SUMMARY */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Validation Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div
              className={`rounded-2xl p-5 border ${
                employeeData?.taskWeightageMatched
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <h3 className="font-semibold">Task Weightage Validation</h3>

              <p className="mt-2">
                {employeeData?.taskWeightageMatched ? "Matched" : "Mismatch"}
              </p>
            </div>

            <div
              className={`rounded-2xl p-5 border ${
                employeeData?.grandTotalMatched
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <h3 className="font-semibold">Grand Total Validation</h3>

              <p className="mt-2">
                {employeeData?.grandTotalMatched ? "Matched" : "Mismatch"}
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Employee Appraisal Information
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                {
                  label: "Responsibilities",
                  value: employeeData?.responsibilities,
                },
                {
                  label: "MOU Weightage",
                  value: employeeData?.mouWeightage,
                },
                {
                  label: "MOU Deliverables",
                  value: employeeData?.mouDeliverables,
                },
                {
                  label: "MOU Achievement",
                  value: employeeData?.mouAchievement,
                },
                {
                  label: "Declared Task Weightage",
                  value: employeeData?.totalTaskWeightage,
                },
                {
                  label: "Calculated Task Weightage",
                  value: employeeData?.calculatedTotalTaskWeightage,
                },
                {
                  label: "Calculated Grand Total",
                  value: employeeData?.calculatedGrandTotal,
                },
                {
                  label: "Exceptional Contribution",
                  value: employeeData?.exceptionalContribution,
                },
                {
                  label: "Constraints",
                  value: employeeData?.constraints,
                },
                {
                  label: "Current Assignment Training",
                  value: employeeData?.currentAssignmentTraining,
                },
                {
                  label: "Future Career Training",
                  value: employeeData?.futureCareerTraining,
                },
                {
                  label: "Immovable Property Return Filed",
                  value: employeeData?.immovablePropertyReturnFiled
                    ? "Yes"
                    : "No",
                },
                {
                  label: "Immovable Property Return Date",
                  value: employeeData?.immovablePropertyReturnDate
                    ? new Date(
                        employeeData.immovablePropertyReturnDate,
                      ).toLocaleDateString("en-IN")
                    : "N/A",
                },
                {
                  label: "Medical Checkup Done",
                  value: employeeData?.medicalCheckupDone ? "Yes" : "No",
                },
                {
                  label: "Annual Work Plan Set",
                  value: employeeData?.annualWorkPlanSetForOfficers
                    ? "Yes"
                    : "No",
                },
                {
                  label: "Created At",
                  value: employeeData?.createdAt
                    ? new Date(employeeData.createdAt).toLocaleString("en-IN")
                    : "N/A",
                },
                {
                  label: "Updated At",
                  value: employeeData?.updatedAt
                    ? new Date(employeeData.updatedAt).toLocaleString("en-IN")
                    : "N/A",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white hover:shadow-md transition-all"
                >
                  <p className="text-sm text-gray-500">{item.label}</p>

                  <h3 className="text-gray-900 font-semibold mt-2 break-words">
                    {item.value || "N/A"}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        

        {/* TASKS */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900">Tasks Details</h2>

            <p className="text-gray-500 mt-1">
              Assigned tasks and achievements
            </p>
          </div>

          <div className="p-6 md:p-8">
            {employeeData?.tasks?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-4">#</th>

                      <th className="text-left p-4">Task Name</th>

                      <th className="text-left p-4">Weightage</th>

                      <th className="text-left p-4">Deliverables</th>

                      <th className="text-left p-4">Achievement</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employeeData.tasks.map((task, index) => (
                      <tr
                        key={task?._id?.$oid || task?._id || index}
                        className="border-b"
                      >
                        <td className="p-4">{index + 1}</td>

                        <td className="p-4 font-medium">{task?.taskName}</td>

                        <td className="p-4">{task?.weightage}</td>

                        <td className="p-4">{task?.deliverables}</td>

                        <td className="p-4">{task?.achievement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
            ) : (
              <div className="text-center py-10 text-gray-500">
                No Tasks Available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
