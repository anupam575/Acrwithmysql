// import { useEffect, useState } from "react";
// import API from "../../../utils/axiosInstance";

// /**
//  * =========================
//  * EMPLOYEE DETAILS HOOK (DEBUG VERSION)
//  * =========================
//  */
// function useEmployeeDetails(employeeId) {
//   const [employeeData, setEmployeeData] = useState(null);
//   const [loading, setLoading] = useState(false); // better default
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!employeeId) {
//       console.warn("❌ employeeId missing in hook");
//       return;
//     }

//     const fetchEmployeeDetails = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // =========================
//         // DEBUG LOG
//         // =========================
//         console.log("🚀 Fetching Employee Details for ID:", employeeId);

//         const url = `/self-appraisal/viewer/${employeeId}`;
//         console.log("📡 API CALL:", url);

//         const response = await API.get(url);

//         console.log("✅ API RESPONSE:", response?.data);

//         // =========================
//         // SAFE SET
//         // =========================
//         setEmployeeData(response.data.data);
//       } catch (err) {
//         console.error("❌ API ERROR FULL:", err);

//         console.error("❌ RESPONSE ERROR:", err?.response?.data);

//         setError(
//           err?.response?.data?.message || "Failed to fetch employee details",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeDetails();
//   }, [employeeId]);

//   return { employeeData, loading, error };
// }
// export default function EmployeeDetailsViewing({ employeeId }) {
//   const { employeeData, loading, error } = useEmployeeDetails(employeeId);

//   // =========================
//   // LOADING (UNCHANGED UI)
//   // =========================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-8">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

//             <div>
//               <h2 className="font-semibold text-lg">Loading Employee Data</h2>

//               <p className="text-sm text-gray-500">Please wait...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // ERROR (UNCHANGED UI)
//   // =========================
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//         <div className="bg-white border border-red-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-sm">
//           <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl mb-5">
//             !
//           </div>

//           <h2 className="text-2xl font-bold text-gray-900">
//             Something went wrong
//           </h2>

//           <p className="text-gray-500 mt-2">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // NO DATA (UNCHANGED UI)
//   // =========================
//   if (!employeeData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//         <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center max-w-lg w-full">
//           <h2 className="text-2xl font-bold text-gray-900">
//             No Employee Data Found
//           </h2>

//           <p className="text-gray-500 mt-2">
//             Employee details are not available.
//           </p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 shadow-sm relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

//           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div>
//               <p className="text-gray-300 text-sm uppercase tracking-widest">
//                 Section II – Self-appraisal of the officer reported upon
//               </p>

//               <h1 className="text-white text-3xl font-bold mt-3">
//                 Employee Appraisal Details
//               </h1>

//               <p className="text-gray-400 mt-2">
//                 Detailed employee appraisal information and reporting
//                 assessment.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
//                 <p className="text-xs text-gray-300">Financial Year</p>

//                 <p className="text-white font-semibold mt-1">
//                   {employeeData?.currentFinancialYear || "N/A"}
//                 </p>
//               </div>

//               <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
//                 <p className="text-xs text-gray-300">Grand Total</p>

//                 <p className="text-white font-semibold mt-1">
//                   {employeeData?.calculatedGrandTotal || 0}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* VALIDATION SUMMARY */}
//         <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">
//             Validation Summary
//           </h2>

//           <div className="grid md:grid-cols-2 gap-5">
//             <div
//               className={`rounded-2xl p-5 border ${
//                 employeeData?.taskWeightageMatched
//                   ? "bg-green-50 border-green-200"
//                   : "bg-red-50 border-red-200"
//               }`}
//             >
//               <h3 className="font-semibold">Task Weightage Validation</h3>

//               <p className="mt-2">
//                 {employeeData?.taskWeightageMatched ? "Matched" : "Mismatch"}
//               </p>
//             </div>

//             <div
//               className={`rounded-2xl p-5 border ${
//                 employeeData?.grandTotalMatched
//                   ? "bg-green-50 border-green-200"
//                   : "bg-red-50 border-red-200"
//               }`}
//             >
//               <h3 className="font-semibold">Grand Total Validation</h3>

//               <p className="mt-2">
//                 {employeeData?.grandTotalMatched ? "Matched" : "Mismatch"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* DETAILS */}
//         <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="border-b border-gray-100 px-8 py-6">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Employee Appraisal Information
//             </h2>
//           </div>

//           <div className="p-6 md:p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//               {[
//                 {
//                   label: "Responsibilities",
//                   value: employeeData?.responsibilities,
//                 },
//                 {
//                   label: "MOU Weightage",
//                   value: employeeData?.mouWeightage,
//                 },
//                 {
//                   label: "MOU Deliverables",
//                   value: employeeData?.mouDeliverables,
//                 },
//                 {
//                   label: "MOU Achievement",
//                   value: employeeData?.mouAchievement,
//                 },
//                 {
//                   label: "Declared Task Weightage",
//                   value: employeeData?.totalTaskWeightage,
//                 },
//                 {
//                   label: "Calculated Task Weightage",
//                   value: employeeData?.calculatedTotalTaskWeightage,
//                 },
//                 {
//                   label: "Calculated Grand Total",
//                   value: employeeData?.calculatedGrandTotal,
//                 },
//                 {
//                   label: "Exceptional Contribution",
//                   value: employeeData?.exceptionalContribution,
//                 },
//                 {
//                   label: "Constraints",
//                   value: employeeData?.constraints,
//                 },
//                 {
//                   label: "Current Assignment Training",
//                   value: employeeData?.currentAssignmentTraining,
//                 },
//                 {
//                   label: "Future Career Training",
//                   value: employeeData?.futureCareerTraining,
//                 },
//                 {
//                   label: "Immovable Property Return Filed",
//                   value: employeeData?.immovablePropertyReturnFiled
//                     ? "Yes"
//                     : "No",
//                 },
//                 {
//                   label: "Immovable Property Return Date",
//                   value: employeeData?.immovablePropertyReturnDate
//                     ? new Date(
//                         employeeData.immovablePropertyReturnDate,
//                       ).toLocaleDateString("en-IN")
//                     : "N/A",
//                 },
//                 {
//                   label: "Medical Checkup Done",
//                   value: employeeData?.medicalCheckupDone ? "Yes" : "No",
//                 },
//                 {
//                   label: "Annual Work Plan Set",
//                   value: employeeData?.annualWorkPlanSetForOfficers
//                     ? "Yes"
//                     : "No",
//                 },
//                 {
//                   label: "Created At",
//                   value: employeeData?.createdAt
//                     ? new Date(employeeData.createdAt).toLocaleString("en-IN")
//                     : "N/A",
//                 },
//                 {
//                   label: "Updated At",
//                   value: employeeData?.updatedAt
//                     ? new Date(employeeData.updatedAt).toLocaleString("en-IN")
//                     : "N/A",
//                 },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white hover:shadow-md transition-all"
//                 >
//                   <p className="text-sm text-gray-500">{item.label}</p>

//                   <h3 className="text-gray-900 font-semibold mt-2 break-words">
//                     {item.value || "N/A"}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
// <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
//   <label className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-600">
//     Employee Signature
//   </label>

//   {employeeData?.officerSignature?.url ? (
//     <img
//       src={`http://localhost:4000${employeeData.officerSignature.url}`}
//       alt="Reporting Officer Signature"
//       className="h-40 w-auto object-contain"
//     />
//   ) : (
//     <p className="text-sm text-gray-400">No Signature Available</p>
//   )}
// </div>
//         {/* TASKS */}
//         <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="border-b border-gray-100 px-8 py-6">
//             <h2 className="text-2xl font-bold text-gray-900">Tasks Details</h2>

//             <p className="text-gray-500 mt-1">
//               Assigned tasks and achievements
//             </p>
//           </div>

//           <div className="p-6 md:p-8">
//             {employeeData?.tasks?.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[900px]">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="text-left p-4">#</th>

//                       <th className="text-left p-4">Task Name</th>

//                       <th className="text-left p-4">Weightage</th>

//                       <th className="text-left p-4">Deliverables</th>

//                       <th className="text-left p-4">Achievement</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {employeeData.tasks.map((task, index) => (
//                       <tr
//                         key={task?._id?.$oid || task?._id || index}
//                         className="border-b"
//                       >
//                         <td className="p-4">{index + 1}</td>

//                         <td className="p-4 font-medium">{task?.taskName}</td>

//                         <td className="p-4">{task?.weightage}</td>

//                         <td className="p-4">{task?.deliverables}</td>

//                         <td className="p-4">{task?.achievement}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-10 text-gray-500">
//                 No Tasks Available
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

/**
 * =========================
 * EMPLOYEE DETAILS HOOK (DEBUG VERSION)
 * =========================
 */
function useEmployeeDetails(employeeId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false); // better default
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) {
      console.warn("❌ employeeId missing in hook");
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // =========================
        // DEBUG LOG
        // =========================
        console.log("🚀 Fetching Employee Details for ID:", employeeId);

        const url = `/self-appraisal/viewer/${employeeId}`;
        console.log("📡 API CALL:", url);

        const response = await API.get(url);

        console.log("✅ API RESPONSE:", response?.data);

        // =========================
        // SAFE SET
        // =========================
        setEmployeeData(response.data.data);
      } catch (err) {
        console.error("❌ API ERROR FULL:", err);
        console.error("❌ RESPONSE ERROR:", err?.response?.data);

        setError(
          err?.response?.data?.message || "Failed to fetch employee details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  return { employeeData, loading, error };
}

export default function EmployeeDetailsViewing({ employeeId }) {
  const { employeeData, loading, error } = useEmployeeDetails(employeeId);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="h-1.5 bg-[#0b4a7f]" />

          <div className="flex items-center gap-4 p-7">
            <div className="h-11 w-11 shrink-0 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7f]" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0b4a7f]">
                Government HRMS
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Loading Employee Data
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Please wait while appraisal information is retrieved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 p-5">
        <div className="w-full max-w-lg overflow-hidden rounded-xl border border-red-200 bg-white shadow-lg">
          <div className="h-1.5 bg-red-600" />

          <div className="p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-2xl font-extrabold text-red-600">
              !
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">
              Data Retrieval Error
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Something Went Wrong
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // NO DATA
  // =========================
  if (!employeeData) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 p-5">
        <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="h-1.5 bg-[#0b4a7f]" />

          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xl font-extrabold text-[#0b4a7f]">
              0
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0b4a7f]">
              Employee Appraisal
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              No Employee Data Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Employee details are not available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const details = [
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
      value: employeeData?.immovablePropertyReturnFiled ? "Yes" : "No",
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
      value: employeeData?.annualWorkPlanSetForOfficers ? "Yes" : "No",
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
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
        <section className="overflow-hidden rounded-xl border border-blue-900 bg-[#0b4a7f] shadow-lg">
          <div className="border-b border-white/15 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100">
                    APAR
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">
                    Section II
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Employee Appraisal Details
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
                  Self-appraisal information of the officer reported upon,
                  including targets, achievements, validations, and assigned
                  tasks.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-100">
                  Record Available
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/15 sm:grid-cols-3">
            <HeaderMetric
              label="Financial Year"
              value={employeeData?.currentFinancialYear || "N/A"}
            />

            <HeaderMetric
              label="Grand Total"
              value={employeeData?.calculatedGrandTotal || 0}
            />

            <HeaderMetric
              label="Assigned Tasks"
              value={employeeData?.tasks?.length || 0}
            />
          </div>
        </section>

        {/* VALIDATION SUMMARY */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="System Verification"
            title="Validation Summary"
            description="Automated validation of declared and calculated appraisal values."
          />

          <div className="grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-2">
            <ValidationCard
              title="Task Weightage Validation"
              matched={employeeData?.taskWeightageMatched}
              description="Declared task weightage compared with calculated task weightage."
            />

            <ValidationCard
              title="Grand Total Validation"
              matched={employeeData?.grandTotalMatched}
              description="Declared grand total compared with the system-calculated total."
            />
          </div>
        </section>

        {/* DETAILS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Appraisal Record"
            title="Employee Appraisal Information"
            description="Complete appraisal, training, compliance, and administrative information."
          />

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {details.map((item, index) => (
              <DetailCard
                key={index}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </section>

        {/* SIGNATURE */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Authentication"
            title="Employee Signature"
            description="Digitally uploaded signature associated with the self-appraisal record."
          />

          <div className="p-5 sm:p-6">
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
              {employeeData?.officerSignature?.url ? (
                <>
                  <div className="flex min-h-40 w-full max-w-lg items-center justify-center rounded-lg border border-slate-200 bg-white p-4">
                    <img
                      src={`http://localhost:4000${employeeData.officerSignature.url}`}
                      alt="Reporting Officer Signature"
                      className="max-h-40 w-auto max-w-full object-contain"
                    />
                  </div>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Signature Available
                  </span>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-bold text-slate-400">
                    —
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    No Signature Available
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    No signature file is attached to this appraisal record.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TASKS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Assigned Work"
            title="Task Details"
            description="Assigned tasks, weightage, deliverables, and recorded achievements."
            badge={`${employeeData?.tasks?.length || 0} Tasks`}
          />

          <div className="p-5 sm:p-6">
            {employeeData?.tasks?.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-300">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-sm">
                    <thead className="bg-[#0b4a7f] text-white">
                      <tr>
                        <th className="w-16 border-r border-blue-800 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                          #
                        </th>

                        <th className="border-r border-blue-800 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                          Task Name
                        </th>

                        <th className="w-32 border-r border-blue-800 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide">
                          Weightage
                        </th>

                        <th className="border-r border-blue-800 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                          Deliverables
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">
                          Achievement
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {employeeData.tasks.map((task, index) => (
                        <tr
                          key={task?._id?.$oid || task?._id || index}
                          className={`transition hover:bg-blue-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <td className="border-r border-t border-slate-300 px-4 py-4 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-xs font-extrabold text-[#0b4a7f]">
                              {index + 1}
                            </span>
                          </td>

                          <td className="border-r border-t border-slate-300 px-4 py-4 font-semibold text-slate-900">
                            {task?.taskName || "N/A"}
                          </td>

                          <td className="border-r border-t border-slate-300 px-4 py-4 text-center">
                            <span className="inline-flex min-w-16 justify-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 font-bold text-[#0b4a7f]">
                              {task?.weightage ?? "N/A"}
                            </span>
                          </td>

                          <td className="border-r border-t border-slate-300 px-4 py-4 leading-6 text-slate-700">
                            {task?.deliverables || "N/A"}
                          </td>

                          <td className="border-t border-slate-300 px-4 py-4 leading-6 text-slate-700">
                            {task?.achievement || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xl font-extrabold text-[#0b4a7f]">
                  0
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  No Tasks Available
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  No assigned task information is available for this employee.
                </p>
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-slate-500">
              On smaller screens, scroll horizontally inside the task table to
              view all columns.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <div className="flex flex-col gap-2 border-t border-slate-300 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Employee appraisal viewing module</span>
          <span className="font-semibold text-[#0b4a7f]">
            Government HRMS Portal
          </span>
        </div>
      </div>
    </main>
  );
}

function HeaderMetric({ label, value }) {
  return (
    <div className="bg-white/5 px-5 py-4 sm:px-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-blue-200">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold text-white">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, badge }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0b4a7f]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>

        {badge && (
          <span className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#0b4a7f]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function ValidationCard({ title, matched, description }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        matched
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
              matched ? "text-emerald-700" : "text-red-700"
            }`}
          >
            Validation Check
          </p>

          <h3 className="mt-1 text-sm font-bold text-slate-900">
            {title}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
            matched
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {matched ? "Matched" : "Mismatch"}
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
        {value || "N/A"}
      </p>
    </article>
  );
}