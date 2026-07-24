"use client";

import React, { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

const ReportingViewing = ({ employeeId }) => {
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />
            <h2 className="mt-4 text-base font-bold text-slate-900">Loading APAR Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while performance records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
              —
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">No APAR Found</h2>
            <p className="mt-1 text-sm text-slate-500">
              No annual performance assessment records are currently available.
            </p>
          </div>
        </div>
      </div>
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
                  APAR Reporting Dashboard
                </h1>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View section-wise annual performance assessment details submitted by reporting officers.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                {data.length} Record{data.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>APAR Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Reporting View</span>
          </div>
        </header>

      {/* APAR Tabs */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">Reporting Officer Records</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a reporting officer to view the complete APAR record.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-4">
        {data.map((apar, index) => (
          <button
            key={apar?._id || index}
            onClick={() => setActiveTab(index)}
            className={`rounded-md border p-3 text-left transition ${
              activeTab === index
                ? "border-blue-800 bg-blue-800 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                    activeTab === index ? "text-indigo-100" : "text-slate-400"
                  }`}
                >
                  Reporting officer {index + 1}
                </span>

                <div
                  className={`h-3 w-3 rounded-full ${
                    activeTab === index ? "bg-green-400" : "bg-slate-300"
                  }`}
                />
              </div>

              <div className="mt-3 border-t border-current/20 pt-3">
                <p className="mt-1 text-sm font-bold">
                  {apar?.reportingOfficerId?.firstName}{" "}
                  {apar?.reportingOfficerId?.lastName}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    activeTab === index ? "text-indigo-100" : "text-slate-500"
                  }`}
                >
                  {apar?.reportingOfficerId?.department?.department_name}
                </p>
              </div>
            </div>
          </button>
        ))}
          </div>
        </section>

        {/* Main Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Top Banner */}
        <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
              Employee Performance Record
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">APAR Details</h2>

            <p className="mt-1 text-xs text-blue-100 sm:text-sm">
              Complete Assessment Information
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          {/* Employee Summary */}
          <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Reporting Officer</p>

                <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                  {item?.reportingOfficerId?.firstName}{" "}
                  {item?.reportingOfficerId?.lastName}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {item?.reportingOfficerId?.department?.department_name}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-800 text-xl font-bold text-white shadow-sm">
                {item?.reportingOfficerId?.firstName?.charAt(0)}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {section.label}
                  </p>

                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-800 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <h3 className="text-sm font-semibold leading-6 text-slate-800">
                    {section.value || "-"}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {section6 && (
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Header */}
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
                <h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">
                  Section 6 - Performance Assessment
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Weightage & Reporting Evaluation Matrix
                </p>
              </div>

              <div className="p-4 sm:p-5">
                {/* MOU Summary */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">MOU Weightage</p>
                    <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                      {section6.mou.weightage}
                    </h3>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Reporting Absolute</p>
                    <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                      {section6.mou.reportingAbsolute}
                    </h3>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Reporting Weighted</p>
                    <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                      {section6.mou.reportingWeighted}
                    </h3>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Initials</p>
                    <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                      {section6.mou.initials}
                    </h3>
                  </div>
                </div>

                {/* Task Table */}
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr className="bg-[#0b3a6f] text-white">
                          <th className="px-3 py-3 text-left">Task Name</th>
                          <th className="px-3 py-3 text-center">Weightage</th>
                          <th className="px-3 py-3 text-center">
                            Reporting Absolute
                          </th>
                          <th className="px-3 py-3 text-center">
                            Reporting Weighted
                          </th>
                          <th className="px-3 py-3 text-center">Initials</th>
                        </tr>
                      </thead>

                      <tbody>
                        {section6.tasks?.map((task, index) => (
                          <tr
                            key={task._id}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-slate-50" : "bg-white"
                            } hover:bg-indigo-50 transition`}
                          >
                            <td className="px-3 py-3 font-medium text-slate-800">
                              {task.taskName}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {task.weightage}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {task.reportingAbsolute}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {task.reportingWeighted}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {task.initials}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      <tfoot>
                        <tr className="bg-blue-50 font-bold text-blue-900">
                          <td className="px-3 py-3">TOTAL</td>

                          <td className="px-3 py-3 text-center">
                            {section6.totalWeightage}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {section6.totalReportingAbsolute}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {section6.totalReportingWeighted}
                          </td>

                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Grand Total Cards */}
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">Grand Weightage</p>
                    <h3 className="mt-1 text-xl font-bold text-blue-900">
                      {section6.grandWeightage}
                    </h3>
                  </div>

                  <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">Grand Reporting Absolute</p>
                    <h3 className="mt-1 text-xl font-bold text-blue-900">
                      {section6.grandReportingAbsolute}
                    </h3>
                  </div>

                  <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">Grand Reporting Weighted</p>
                    <h3 className="mt-1 text-xl font-bold text-blue-900">
                      {section6.grandReportingWeighted}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {item?.section7?.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Header */}
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
                <h2 className="text-2xl font-bold">
                  Section 7 - Competency Assessment
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Core & Functional Competency Evaluation Matrix
                </p>
              </div>

              <div className="p-4 sm:p-5">
                {/* Summary Cards */}
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">Total Competency Score</p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {item?.summary?.total || 0}
                    </h3>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">Overall Competency Rating</p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {item?.summary?.overall || 0}
                    </h3>
                  </div>
                </div>

                {/* Competency Table */}
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px]">
                      <thead>
                        <tr className="bg-[#0b3a6f] text-white">
                          <th className="px-3 py-3 text-left">Sl. No.</th>

                          <th className="px-3 py-3 text-left">Competency</th>

                          <th className="px-3 py-3 text-center">Rating</th>

                          <th className="px-3 py-3 text-center">Initials</th>
                        </tr>
                      </thead>

                      <tbody>
                        {item?.section7?.map((row, index) => (
                          <tr
                            key={row._id}
                            className={`border-b transition hover:bg-violet-50 ${
                              index % 2 === 0 ? "bg-slate-50" : "bg-white"
                            }`}
                          >
                            <td className="px-3 py-3 font-semibold text-slate-700">
                              {row.slNo}
                            </td>

                            <td className="px-3 py-3">
                              <div className="max-w-xl">
                                <p className="font-medium text-slate-800">
                                  {row.competency}
                                </p>
                              </div>
                            </td>

                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                                {row.reportingAuthority}
                              </span>
                            </td>

                            <td className="px-3 py-3 text-center font-medium text-slate-700">
                              {row.initials}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      <tfoot>
                        <tr className="bg-blue-50 text-blue-900">
                          <td colSpan={2} className="px-3 py-3 font-bold">
                            Overall Assessment
                          </td>

                          <td className="px-3 py-3 text-center font-bold">
                            {item?.summary?.total || 0}
                          </td>

                          <td className="px-3 py-3 text-center font-bold">
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
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
                <h2 className="text-2xl font-bold">Final Assessment</h2>

                <p className="mt-0.5 text-xs text-slate-500">Reporting Officer Evaluation</p>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Overall Grade</p>

                    <h3 className="mt-1 text-xl font-bold text-emerald-700">
                      {finalAssessment.overallGrade || "-"}
                    </h3>
                  </div>
<div className="flex min-h-36 w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="flex flex-col items-center">
                      <label className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">
                        Reporting Officer Signature
                      </label>

                      <div className="flex h-24 w-56 items-center justify-center rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                        <img
                          src={`http://localhost:4000${item?.officerSignature?.url}`}
                          alt="Reporting Officer Signature"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Reporting Date</p>

                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {finalAssessment.reportingDate
                        ? new Date(
                            finalAssessment.reportingDate,
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </h3>
                  </div>
                </div>

                {/* Pen Picture */}

                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Pen Picture
                  </p>

                  <p className="text-sm leading-6 text-slate-700">
                    {finalAssessment.penPicture || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official APAR Reporting Record • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
};

export default ReportingViewing;