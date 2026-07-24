"use client";

import React, { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

const AparView = ({ employeeId }) => {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState(0);

useEffect(() => {
if (employeeId) {
fetchData();
}
}, [employeeId]);

const fetchData = async () => {
try {
setLoading(true);
const res = await API.get(`/reporter/report/${employeeId}`);
setData(res?.data?.data || []);
} catch (err) {
console.log(err);
setData([]);
} finally {
setLoading(false);
}
};

if (loading) {
return ( <div className="flex min-h-[500px] items-center justify-center"> <div className="rounded-3xl bg-white px-8 py-6 shadow-xl"> <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" /> <p className="mt-4 text-slate-600 font-medium">
Loading APAR Details... </p> </div> </div>
);
}

if (!data.length) {
return ( <div className="flex min-h-[500px] items-center justify-center"> <div className="rounded-3xl bg-white p-10 shadow-xl text-center"> <h2 className="text-2xl font-bold text-slate-800">
No APAR Found </h2> <p className="mt-2 text-slate-500">
No performance records available. </p> </div> </div>
);
}

const item = data[activeTab];

const sections = [
{ label: "Section 1", value: item?.section1 },
{ label: "Section 2", value: item?.section2 },
{ label: "Section 3", value: item?.section3 },
{ label: "Section 4", value: item?.section4 },
{ label: "Section 5", value: item?.section5 },
];
const section6 = item?.section6;
const section7 = item?.section7 || [];
const section7Summary = item?.summary;


const finalAssessment = {
  penPicture: item?.penPicture,
  overallGrade: item?.overallGrade,
  reportingDate: item?.reportingDate,
  signature: item?.signature,
  designation: item?.designation,
};
return ( <div className="min-h-screen rounded-[40px] bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 lg:p-8">

  {/* Header */}
  <div className="mb-8">
    <h1 className="text-4xl font-black text-slate-800">
      APAR Dashboard
    </h1>
    <p className="mt-2 text-slate-500">
      Annual Performance Assessment Report
    </p>
  </div>

  {/* APAR Tabs */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
    {data.map((apar, index) => (
      <button
        key={apar?._id || index}
        onClick={() => setActiveTab(index)}
        className={`group relative overflow-hidden rounded-[28px] border p-6 text-left transition-all duration-500 ${
          activeTab === index
            ? "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] scale-[1.02]"
            : "bg-white/80 backdrop-blur-xl border-white shadow-lg hover:-translate-y-1 hover:shadow-2xl"
        }`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                activeTab === index
                  ? "text-indigo-100"
                  : "text-slate-400"
              }`}
            >
              Reporting officer {index + 1}
            </span>

            <div
              className={`h-3 w-3 rounded-full ${
                activeTab === index
                  ? "bg-green-400"
                  : "bg-slate-300"
              }`}
            />
          </div>

          

          <div className="mt-5 border-t border-white/20 pt-4">
            

            <p className="mt-1 font-semibold">
              {apar?.reportingOfficerId?.firstName}{" "}
              {apar?.reportingOfficerId?.lastName}
            </p>

            <p
              className={`mt-1 text-sm ${
                activeTab === index
                  ? "text-indigo-100"
                  : "text-slate-500"
              }`}
            >
              {
                apar?.reportingOfficerId?.department
                  ?.department_name
              }
            </p>
          </div>
        </div>
      </button>
    ))}
  </div>

  {/* Main Card */}
  <div className="overflow-hidden rounded-[36px] border border-white/30 bg-white/70 backdrop-blur-2xl shadow-[0_25px_80px_-20px_rgba(15,23,42,0.15)]">

    {/* Top Banner */}
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 px-8 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_40%)]" />

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
          Employee Performance Record
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          APAR Details
        </h2>

        <p className="mt-2 text-indigo-100">
          Complete Assessment Information
        </p>
      </div>
    </div>

    <div className="p-8">

      {/* Employee Summary */}
      <div className="mb-8 rounded-[30px] bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm text-slate-400">
              Reporting Officer
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {item?.reportingOfficerId?.firstName}{" "}
              {item?.reportingOfficerId?.lastName}
            </h3>

            <p className="mt-3 text-slate-300">
              {
                item?.reportingOfficerId?.department
                  ?.department_name
              }
            </p>

            
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold shadow-2xl">
            {item?.reportingOfficerId?.firstName?.charAt(0)}
          </div>

        </div>
      </div>

      {/* Sections */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="group rounded-[28px] border border-slate-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {section.label}
              </p>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                {index + 1}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <h3 className="text-lg font-bold leading-relaxed text-slate-800">
                {section.value || "-"}
              </h3>
            </div>
          </div>
        ))}
      </div>


      {section6 && (
  <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">

    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-6 text-white">
      <h2 className="text-2xl font-bold">
        Section 6 - Performance Assessment
      </h2>
      <p className="text-emerald-100">
        Weightage & Reporting Evaluation Matrix
      </p>
    </div>

    <div className="p-8">

      {/* MOU Summary */}
      <div className="mb-8 grid gap-5 md:grid-cols-4">

        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white">
          <p className="text-sm opacity-80">MOU Weightage</p>
          <h3 className="mt-2 text-3xl font-bold">
            {section6.mou.weightage}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 p-5 text-white">
          <p className="text-sm opacity-80">
            Reporting Absolute
          </p>
          <h3 className="mt-2 text-3xl font-bold">
            {section6.mou.reportingAbsolute}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 text-white">
          <p className="text-sm opacity-80">
            Reporting Weighted
          </p>
          <h3 className="mt-2 text-3xl font-bold">
            {section6.mou.reportingWeighted}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-5 text-white">
          <p className="text-sm opacity-80">Initials</p>
          <h3 className="mt-2 text-3xl font-bold">
            {section6.mou.initials}
          </h3>
        </div>

      </div>

      {/* Task Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-4 text-left">
                  Task Name
                </th>
                <th className="px-6 py-4 text-center">
                  Weightage
                </th>
                <th className="px-6 py-4 text-center">
                  Reporting Absolute
                </th>
                <th className="px-6 py-4 text-center">
                  Reporting Weighted
                </th>
                <th className="px-6 py-4 text-center">
                  Initials
                </th>
              </tr>
            </thead>

            <tbody>
              {section6.tasks?.map((task, index) => (
                <tr
                  key={task._id}
                  className={`border-b ${
                    index % 2 === 0
                      ? "bg-slate-50"
                      : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {task.taskName}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {task.weightage}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {task.reportingAbsolute}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {task.reportingWeighted}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {task.initials}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold">
                <td className="px-6 py-4">
                  TOTAL
                </td>

                <td className="px-6 py-4 text-center">
                  {section6.totalWeightage}
                </td>

                <td className="px-6 py-4 text-center">
                  {section6.totalReportingAbsolute}
                </td>

                <td className="px-6 py-4 text-center">
                  {section6.totalReportingWeighted}
                </td>

                <td />
              </tr>
            </tfoot>

          </table>
        </div>
      </div>

      {/* Grand Total Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
          <p className="text-indigo-200">
            Grand Weightage
          </p>
          <h3 className="mt-2 text-4xl font-bold">
            {section6.grandWeightage}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
          <p className="text-emerald-200">
            Grand Reporting Absolute
          </p>
          <h3 className="mt-2 text-4xl font-bold">
            {section6.grandReportingAbsolute}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <p className="text-purple-200">
            Grand Reporting Weighted
          </p>
          <h3 className="mt-2 text-4xl font-bold">
            {section6.grandReportingWeighted}
          </h3>
        </div>

      </div>

    </div>
  </div>
)}

{item?.section7?.length > 0 && (
  <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">

    {/* Header */}
    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-8 py-6 text-white">
      <h2 className="text-2xl font-bold">
        Section 7 - Competency Assessment
      </h2>

      <p className="mt-1 text-purple-100">
        Core & Functional Competency Evaluation Matrix
      </p>
    </div>

    <div className="p-8">

      {/* Summary Cards */}
      <div className="mb-8 grid gap-5 md:grid-cols-2">

        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-lg">
          <p className="text-indigo-200">
            Total Competency Score
          </p>

          <h3 className="mt-3 text-4xl font-bold">
            {item?.summary?.total || 0}
          </h3>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-fuchsia-700 p-6 text-white shadow-lg">
          <p className="text-purple-200">
            Overall Competency Rating
          </p>

          <h3 className="mt-3 text-4xl font-bold">
            {item?.summary?.overall || 0}
          </h3>
        </div>

      </div>

      {/* Competency Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-slate-900 text-white">

                <th className="px-5 py-4 text-left">
                  Sl. No.
                </th>

                <th className="px-5 py-4 text-left">
                  Competency
                </th>

                <th className="px-5 py-4 text-center">
                  Rating
                </th>

                <th className="px-5 py-4 text-center">
                  Initials
                </th>

              </tr>
            </thead>

            <tbody>
              {item?.section7?.map((row, index) => (
                <tr
                  key={row._id}
                  className={`border-b transition hover:bg-violet-50 ${
                    index % 2 === 0
                      ? "bg-slate-50"
                      : "bg-white"
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {row.slNo}
                  </td>

                  <td className="px-5 py-4">
                    <div className="max-w-xl">
                      <p className="font-medium text-slate-800">
                        {row.competency}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 font-semibold text-violet-700">
                      {row.reportingAuthority}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center font-medium text-slate-700">
                    {row.initials}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">

                <td
                  colSpan={2}
                  className="px-5 py-4 font-bold"
                >
                  Overall Assessment
                </td>

                <td className="px-5 py-4 text-center font-bold">
                  {item?.summary?.total || 0}
                </td>

                <td className="px-5 py-4 text-center font-bold">
                  {item?.summary?.overall || 0}
                </td>

              </tr>
            </tfoot>

          </table>
        </div>

      </div>

    </div>
  </div>
)}


{finalAssessment && (
  <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">

    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-6 text-white">
      <h2 className="text-2xl font-bold">
        Final Assessment
      </h2>

      <p className="text-orange-100">
        Reporting Officer Evaluation
      </p>
    </div>

    <div className="p-8">

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">
            Overall Grade
          </p>

          <h3 className="mt-3 text-4xl font-bold text-emerald-600">
            {finalAssessment.overallGrade || "-"}
          </h3>
        </div>

       
        <div className="rounded-3xl bg-slate-50 p-6">
      <div className="flex flex-col items-center">
  <label className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
    Reporting Officer Signature
  </label>

  <div className="w-72 h-40 rounded-xl border-2 border-gray-200 bg-white shadow-sm p-3 flex items-center justify-center">
    <img
      src={`http://localhost:4000${item?.officerSignature?.url}`}
      alt="Reporting Officer Signature"
      className="max-w-full max-h-full object-contain"
    />
  </div>
</div>

          
        </div>

        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">
            Reporting Date
          </p>

          <h3 className="mt-3 text-xl font-bold text-slate-800">
            {finalAssessment.reportingDate
              ? new Date(
                  finalAssessment.reportingDate
                ).toLocaleDateString("en-IN")
              : "-"}
          </h3>
        </div>

      </div>

      {/* Pen Picture */}

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Pen Picture
        </p>

        <p className="leading-8 text-slate-700">
          {finalAssessment.penPicture || "-"}
        </p>
      </div>

    </div>
  </div>
)}
    </div>
  </div>
</div>

);
};

export default AparView;
