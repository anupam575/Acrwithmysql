"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../../utils/axiosInstance";
function useEmployeeDetails(appraisalId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appraisalId) return;

    let isMounted = true;

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🚀 Fetching Employee Details for ID:", appraisalId);

        const response = await API.get(
          `/self-appraisal/view/${appraisalId}`
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
  }, [appraisalId]);

  return { employeeData, loading, error };
}

export default function EmployeeDetailsView() {
  // ✅ USE PARAMS HERE (NO PROP NEEDED)
  const params = useParams();
  const appraisalId = params?.id;
const pageRef = useRef();
  console.log("📌 appraisalId from useParams:", appraisalId);

  const { employeeData, loading, error } =
    useEmployeeDetails(appraisalId);

  console.log("📌 employeeData:", employeeData);
  console.log("📌 loading:", loading);
  console.log("📌 error:", error);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* PAGE HEADER */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Section II – Self-appraisal of the Officer Reported Upon
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Officer Appraisal Details
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Detailed appraisal information, validation status, assigned
                  tasks, achievements, and supporting officer records.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Financial Year
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {employeeData?.currentFinancialYear || "N/A"}
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Grand Total
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {employeeData?.calculatedGrandTotal || 0}
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
              Self-appraisal Details
            </span>
          </div>
        </section>

        {/* VALIDATION SUMMARY */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Validation Summary
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Verification status for task weightage and calculated grand total.
            </p>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2 sm:p-6">
            <div
              className={`rounded-lg border p-4 ${
                employeeData?.taskWeightageMatched
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Validation Check
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-slate-900">
                    Task Weightage Validation
                  </h3>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    employeeData?.taskWeightageMatched
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employeeData?.taskWeightageMatched ? "Matched" : "Mismatch"}
                </span>
              </div>
            </div>

            <div
              className={`rounded-lg border p-4 ${
                employeeData?.grandTotalMatched
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Validation Check
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-slate-900">
                    Grand Total Validation
                  </h3>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    employeeData?.grandTotalMatched
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {employeeData?.grandTotalMatched ? "Matched" : "Mismatch"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* APPRAISAL INFORMATION */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Officer Appraisal Information
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Consolidated self-appraisal and compliance information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
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
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SIGNATURE */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Officer Signature
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Digitally uploaded signature of the officer reported upon.
            </p>
          </div>

          <div className="flex justify-center p-4 sm:p-6">
            <div className="flex min-h-44 w-full max-w-md items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              {employeeData?.officerSignature?.url ? (
                <img
                  src={`http://localhost:4000${employeeData?.officerSignature?.url}`}
                  alt="Officer Signature"
                  className="max-h-36 max-w-full object-contain"
                />
              ) : (
                <p className="text-sm font-medium text-slate-500">
                  Signature not available
                </p>
              )}
            </div>
          </div>
        </section>

        {/* TASK DETAILS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Task Details
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Assigned tasks, deliverables, weightage, and achievements.
            </p>
          </div>

          {employeeData?.tasks?.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#0b4a7f] text-white">
                      <th className="w-16 border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        #
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Task Name
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Weightage
                      </th>

                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Deliverables
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Achievement
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employeeData.tasks.map((task, index) => (
                      <tr
                        key={task?._id?.$oid || task?._id || index}
                        className="border-b border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                      >
                        <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-700">
                          {index + 1}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-900">
                          {task?.taskName || "N/A"}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
                          {task?.weightage || "N/A"}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
                          {task?.deliverables || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          {task?.achievement || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-3 md:hidden">
                {employeeData.tasks.map((task, index) => (
                  <article
                    key={task?._id?.$oid || task?._id || index}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="border-b border-slate-200 bg-[#0b4a7f] px-4 py-3 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                        Task #{index + 1}
                      </p>

                      <h3 className="mt-1 break-words text-sm font-bold">
                        {task?.taskName || "N/A"}
                      </h3>
                    </div>

                    <div className="grid gap-3 p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Weightage
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {task?.weightage || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Deliverables
                        </p>
                        <p className="mt-1 break-words text-sm text-slate-700">
                          {task?.deliverables || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Achievement
                        </p>
                        <p className="mt-1 break-words text-sm text-slate-700">
                          {task?.achievement || "N/A"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-12 text-center text-sm font-medium text-slate-500">
              No Tasks Available
            </div>
          )}
        </section>
      </div>
    </div>
  );
}