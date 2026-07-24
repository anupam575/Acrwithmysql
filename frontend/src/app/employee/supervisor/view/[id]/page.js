"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  PenLine,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import API from "../../../../../utils/axiosInstance";
import { downloadPageAsPDF } from "../../../../../utils/downloadPageAsPDF";

function useSupervisor(appraisalId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    console.log("=================================");
    console.log("Supervisor Hook Triggered");
    console.log("Received appraisalId:", appraisalId);

    if (!appraisalId) {
      console.log("❌ appraisalId missing");
      setError("Appraisal ID is required");
      return;
    }

    const fetchSupervisorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🚀 Calling API...");
        console.log(`/supervisors/viewer/${appraisalId}`);

        const response = await API.get(
          `/supervisors/viewer/${appraisalId}`
        );

        console.log("✅ Full Axios Response:", response);
        console.log("✅ Response Data:", response.data);
        console.log("✅ Supervisor Data:", response.data.data);

        if (isMounted) {
          setEmployeeData(response.data.data);
          console.log("✅ State Updated");
        }
      } catch (err) {
        console.error("❌ API ERROR:", err);
        console.error("Status:", err?.response?.status);
        console.error("Message:", err?.response?.data);

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Failed to fetch supervisor details"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSupervisorDetails();

    return () => {
      isMounted = false;
    };
  }, [appraisalId]);

  return {
    employeeData,
    loading,
    error,
  };
}

const TABS = {
  SUMMARY: "SUMMARY",
  APPRAISAL: "APPRAISAL",
  TIMELINE: "TIMELINE",
  SIGNATURE: "SIGNATURE",
};

export default function SupervisorDetailsView() {
  const params = useParams();
  const pageRef = useRef();

  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);

  console.log("📌 useParams():", params);

  const appraisalId = params?.id;

  console.log("📌 Appraisal ID:", appraisalId);

  const { employeeData, loading, error } =
    useSupervisor(appraisalId);

  console.log("========= COMPONENT =========");
  console.log("loading:", loading);
  console.log("error:", error);
  console.log("employeeData:", employeeData);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#0b4a7f]" />

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Loading Supervisor Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while the appraisal record is retrieved.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to Load Details
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f8] p-4">
        <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0b4a7f]">
            <ClipboardList size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Employee Data Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Employee appraisal details are not available.
          </p>
        </div>
      </div>
    );
  }

  const employeeFields = [
    {
      label: "Name",
      value: employeeData?.name,
      icon: <UserRound size={18} />,
    },
    {
      label: "Financial Year",
      value: employeeData?.financialYear,
      icon: <CalendarDays size={18} />,
    },
    {
      label: "Tasks",
      value: employeeData?.tasks,
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Achievements",
      value: employeeData?.achievements,
      icon: <CheckCircle2 size={18} />,
    },
    {
      label: "Shortfalls",
      value: employeeData?.shortfalls,
      icon: <FileText size={18} />,
    },
    {
      label: "Higher Achievements",
      value: employeeData?.higherAchievements,
      icon: <ShieldCheck size={18} />,
    },
    {
      label: "Place",
      value: employeeData?.place,
      icon: <MapPin size={18} />,
    },
    {
      label: "Date",
      value: employeeData?.date
        ? new Date(employeeData.date).toLocaleDateString("en-IN")
        : null,
      icon: <CalendarDays size={18} />,
    },
    {
      label: "Created At",
      value: employeeData?.createdAt
        ? new Date(employeeData.createdAt).toLocaleString("en-IN")
        : null,
      icon: <Clock3 size={18} />,
    },
    {
      label: "Updated At",
      value: employeeData?.updatedAt
        ? new Date(employeeData.updatedAt).toLocaleString("en-IN")
        : null,
      icon: <Clock3 size={18} />,
    },
  ];

  const summaryFields = employeeFields.slice(0, 4);
  const appraisalFields = employeeFields.slice(2, 8);
  const timelineFields = employeeFields.slice(8, 10);

  return (
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div ref={pageRef} className="mx-auto max-w-7xl space-y-5">
        {/* HEADER */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Annual Performance Appraisal Report
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Supervisor Appraisal Details
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review the complete supervisor self-appraisal record,
                  timeline, and authenticated signature.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <HeaderMetric
                  label="Financial Year"
                  value={employeeData?.financialYear || "N/A"}
                />

                <HeaderMetric
                  label="Record Status"
                  value="Available"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
            <span>Home</span>
            <span>/</span>
            <span>APAR Management</span>
            <span>/</span>
            <span>Supervisor Appraisals</span>
            <span>/</span>
            <span className="font-semibold text-[#0b4a7f]">
              View Details
            </span>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<UserRound size={20} />}
            label="Employee Name"
            value={employeeData?.name}
          />

          <SummaryCard
            icon={<CalendarDays size={20} />}
            label="Financial Year"
            value={employeeData?.financialYear}
          />

          <SummaryCard
            icon={<MapPin size={20} />}
            label="Place"
            value={employeeData?.place}
          />

          <SummaryCard
            icon={<PenLine size={20} />}
            label="Signature"
            value={
              employeeData?.officerSignature?.url
                ? "Available"
                : "Not Available"
            }
          />
        </section>

        {/* TAB NAVIGATION */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto border-b border-slate-200 bg-slate-50">
            <div className="flex min-w-max">
              <TabButton
                active={activeTab === TABS.SUMMARY}
                onClick={() => setActiveTab(TABS.SUMMARY)}
                label="Summary"
                icon={<UserRound size={17} />}
              />

              <TabButton
                active={activeTab === TABS.APPRAISAL}
                onClick={() => setActiveTab(TABS.APPRAISAL)}
                label="Appraisal Details"
                icon={<ClipboardList size={17} />}
              />

              <TabButton
                active={activeTab === TABS.TIMELINE}
                onClick={() => setActiveTab(TABS.TIMELINE)}
                label="Timeline"
                icon={<Clock3 size={17} />}
              />

              <TabButton
                active={activeTab === TABS.SIGNATURE}
                onClick={() => setActiveTab(TABS.SIGNATURE)}
                label="Signature"
                icon={<PenLine size={17} />}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === TABS.SUMMARY && (
              <SectionGrid fields={summaryFields} />
            )}

            {activeTab === TABS.APPRAISAL && (
              <SectionGrid fields={appraisalFields} />
            )}

            {activeTab === TABS.TIMELINE && (
              <div className="grid gap-4 md:grid-cols-2">
                {timelineFields.map((item) => (
                  <DetailCard key={item.label} {...item} />
                ))}
              </div>
            )}

            {activeTab === TABS.SIGNATURE && (
              <SignaturePanel employeeData={employeeData} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function HeaderMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-900">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-bold transition sm:px-6 ${
        active
          ? "border-[#0b4a7f] bg-white text-[#0b4a7f]"
          : "border-transparent text-slate-500 hover:bg-white hover:text-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionGrid({ fields }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fields.map((item) => (
        <DetailCard key={item.label} {...item} />
      ))}
    </div>
  );
}

function DetailCard({ label, value, icon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-slate-900">
            {value ?? "N/A"}
          </p>
        </div>
      </div>
    </article>
  );
}

function SignaturePanel({ employeeData }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          <PenLine size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Supervisor Signature
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Authenticated signature attached to this appraisal record.
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-5">
        {employeeData?.officerSignature?.url ? (
          <img
            src={`http://localhost:4000${employeeData.officerSignature.url}`}
            alt="Supervisor Signature"
            className="max-h-64 w-full object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <PenLine size={26} />
            </div>

            <p className="mt-3 text-sm font-bold text-slate-700">
              Signature Not Available
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No signature has been attached to this record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}