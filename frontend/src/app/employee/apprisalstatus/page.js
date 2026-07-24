"use client";

import { useEffect, useMemo, useState } from "react";
import API from "../../../utils/axiosInstance";

import {
  CalendarToday,
  Timeline,
  Person,
  Description,
  RateReview,
  Update,
  Verified,
  WorkspacePremium,
  BadgeOutlined,
  CheckCircle,
  Cancel,
  ArticleOutlined,
  AccountBalanceOutlined,
  DrawOutlined,
} from "@mui/icons-material";

export default function AcceptanceDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRecordId, setActiveRecordId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAcceptance();
  }, []);

  const fetchAcceptance = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/accept/employee/acceptance");
      const records = res?.data?.data || [];

      setData(records);

      if (records.length) {
        setActiveRecordId((current) => current || records[0]?._id || "");
      }
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message || "Unable to load acceptance records.",
      );
    } finally {
      setLoading(false);
    }
  };

  const activeRecord = useMemo(() => {
    return (
      data.find((item) => String(item?._id) === String(activeRecordId)) ||
      data[0] ||
      null
    );
  }, [data, activeRecordId]);

  const selectRecord = (recordId) => {
    setActiveRecordId(recordId);
    setActiveTab("overview");
  };

  /* ===========================
          LOADING
  ============================ */

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#0b4a7f]" />

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Loading Acceptance Data
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while acceptance records are retrieved.
          </p>
        </div>
      </div>
    );
  }

  /* ===========================
            ERROR
  ============================ */

  if (error) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <Cancel className="mx-auto text-red-500" sx={{ fontSize: 56 }} />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Something Went Wrong
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={fetchAcceptance}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#0b4a7f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083c67]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ===========================
            EMPTY
  ============================ */

  if (!data.length) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Description
            className="mx-auto text-[#0b4a7f]"
            sx={{ fontSize: 58 }}
          />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No Acceptance Record Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are no acceptance records available.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <Timeline sx={{ fontSize: 18 }} />,
    },
    {
      id: "acceptance",
      label: "Acceptance Details",
      icon: <ArticleOutlined sx={{ fontSize: 18 }} />,
    },
    {
      id: "authority",
      label: "Authority Information",
      icon: <AccountBalanceOutlined sx={{ fontSize: 18 }} />,
    },
    {
      id: "signature",
      label: "Signature",
      icon: <DrawOutlined sx={{ fontSize: 18 }} />,
    },
  ];

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
                  Performance Acceptance
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review acceptance records, grades, authority remarks, and
                  submitted signatures through a structured tab-wise view.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Total Records
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {data.length}
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Status
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white">
                    <Verified sx={{ fontSize: 18 }} />
                    Verified
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
              Acceptance Dashboard
            </span>
          </div>
        </section>

        {/* RECORD SELECTOR */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Acceptance Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a financial year to view the corresponding acceptance
              record.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto p-3 sm:p-4">
            {data.map((item, index) => {
              const isActive =
                String(activeRecord?._id) === String(item?._id);

              return (
                <button
                  key={item?._id || index}
                  type="button"
                  onClick={() => selectRecord(item?._id)}
                  className={`min-w-[180px] rounded-lg border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-[#0b4a7f] bg-[#0b4a7f] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isActive ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    Financial Year
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {item?.currentFinancialYear || "N/A"}
                  </p>

                  <p
                    className={`mt-1 truncate text-xs ${
                      isActive ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    Grade: {item?.overallGrade || "N/A"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {activeRecord && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* RECORD HEADER */}

            <div className="bg-[#0b4a7f] px-4 py-4 text-white sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                    Selected Acceptance Record
                  </p>

                  <h2 className="mt-1 flex items-center gap-2 text-lg font-bold sm:text-xl">
                    <Timeline sx={{ fontSize: 24 }} />
                    {activeRecord.currentFinancialYear || "Financial Year N/A"}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-xs text-blue-100 sm:text-sm">
                    <Person fontSize="small" />
                    Officer ID:
                    <span className="font-semibold">
                      {activeRecord.employeeId || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    type={
                      activeRecord.overallGradeConsistent === "Yes"
                        ? "green"
                        : "red"
                    }
                    label={`Grade Consistent: ${
                      activeRecord.overallGradeConsistent || "N/A"
                    }`}
                  />

                  <Badge
                    type={
                      activeRecord.agreeWithRemarks === "Yes" ? "green" : "red"
                    }
                    label={`Remarks: ${
                      activeRecord.agreeWithRemarks || "N/A"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* DETAIL TABS */}

            <div className="border-b border-slate-200 bg-slate-50 px-3 pt-3 sm:px-5">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-t-md border-b-2 px-4 py-2 text-xs font-bold transition sm:text-sm ${
                        isActive
                          ? "border-[#0b4a7f] bg-white text-[#0b4a7f]"
                          : "border-transparent text-slate-500 hover:bg-white hover:text-slate-800"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* OVERVIEW TAB */}

              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoCard
                      icon={<RateReview sx={{ color: "#0b4a7f" }} />}
                      label="Overall Grade"
                      value={activeRecord.overallGrade}
                    />

                    <InfoCard
                      icon={<Description sx={{ color: "#7c3aed" }} />}
                      label="Difference Opinion"
                      value={activeRecord.differenceOpinion || "N/A"}
                    />

                    <InfoCard
                      icon={<BadgeOutlined sx={{ color: "#2563eb" }} />}
                      label="Authority"
                      value={activeRecord.acceptingAuthorityNameDesignation}
                    />

                    <InfoCard
                      icon={<CalendarToday sx={{ color: "#ea580c" }} />}
                      label="Created"
                      value={
                        activeRecord.createdAt
                          ? new Date(
                              activeRecord.createdAt,
                            ).toLocaleDateString("en-IN")
                          : "N/A"
                      }
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Record Summary
                    </h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailItem
                        label="Financial Year"
                        value={activeRecord.currentFinancialYear}
                      />

                      <DetailItem
                        label="Officer ID"
                        value={activeRecord.employeeId}
                      />

                      <DetailItem
                        label="Overall Grade"
                        value={activeRecord.overallGrade}
                      />

                      <DetailItem
                        label="Grade Consistent"
                        value={activeRecord.overallGradeConsistent}
                      />

                      <DetailItem
                        label="Agree With Remarks"
                        value={activeRecord.agreeWithRemarks}
                      />

                      <DetailItem
                        label="Updated"
                        value={
                          activeRecord.updatedAt
                            ? new Date(
                                activeRecord.updatedAt,
                              ).toLocaleDateString("en-IN")
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACCEPTANCE DETAILS TAB */}

              {activeTab === "acceptance" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailPanel
                    title="Acceptance Decision"
                    items={[
                      {
                        label: "Overall Grade",
                        value: activeRecord.overallGrade,
                      },
                      {
                        label: "Grade Consistent",
                        value: activeRecord.overallGradeConsistent,
                      },
                      {
                        label: "Agree With Remarks",
                        value: activeRecord.agreeWithRemarks,
                      },
                    ]}
                  />

                  <DetailPanel
                    title="Remarks and Difference"
                    items={[
                      {
                        label: "Difference Opinion",
                        value: activeRecord.differenceOpinion || "N/A",
                      },
                      {
                        label: "Created Date",
                        value: activeRecord.createdAt
                          ? new Date(
                              activeRecord.createdAt,
                            ).toLocaleDateString("en-IN")
                          : "N/A",
                      },
                      {
                        label: "Updated Date",
                        value: activeRecord.updatedAt
                          ? new Date(
                              activeRecord.updatedAt,
                            ).toLocaleDateString("en-IN")
                          : "N/A",
                      },
                    ]}
                  />
                </div>
              )}

              {/* AUTHORITY TAB */}

              {activeTab === "authority" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
                        <BadgeOutlined />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Accepting Authority
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-slate-900">
                          {activeRecord.acceptingAuthorityNameDesignation ||
                            "N/A"}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                        <Verified />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Acceptance Status
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-slate-900">
                          Acceptance Verified
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIGNATURE TAB */}

              {activeTab === "signature" && (
                <div className="mx-auto max-w-2xl">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <h3 className="text-center text-sm font-bold text-slate-900 sm:text-base">
                      Accepting Authority Signature
                    </h3>

                    <div className="mt-5 flex min-h-56 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-4">
                      {activeRecord?.officerSignature?.url ? (
                        <img
                          src={`http://localhost:4000${activeRecord.officerSignature.url}`}
                          alt="Officer Signature"
                          className="max-h-44 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-500">
                          No Signature Uploaded
                        </span>
                      )}
                    </div>

                    {activeRecord?.officerSignature && (
                      <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
                        <DetailItem
                          label="File"
                          value={activeRecord.officerSignature.originalName}
                        />

                        <DetailItem
                          label="Size"
                          value={`${(
                            activeRecord.officerSignature.size / 1024
                          ).toFixed(1)} KB`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ==========================================================
   STATUS BADGE
========================================================== */

function Badge({ label, type }) {
  const colors = {
    green: "border border-emerald-200 bg-emerald-100 text-emerald-700",
    red: "border border-red-200 bg-red-100 text-red-700",
    blue: "border border-blue-200 bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
        colors[type] || colors.blue
      }`}
    >
      {label}
    </span>
  );
}

/* ==========================================================
   INFO CARD
========================================================== */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <h3 className="mt-1 break-words text-sm font-bold text-slate-900">
            {value || "N/A"}
          </h3>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
}

function DetailPanel({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex flex-col gap-1 rounded-md border border-slate-200 bg-white p-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <span className="text-xs font-medium text-slate-500">
              {item.label}
            </span>

            <span className="break-words text-sm font-semibold text-slate-900 sm:text-right">
              {item.value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}