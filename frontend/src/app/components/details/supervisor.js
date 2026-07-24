import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

function useSupervisor(employeeId) {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const activeRecord = employeeData?.[activeTab];

  useEffect(() => {
    let isMounted = true;

    if (!employeeId) {
      setError("Employee ID is required");
      return;
    }

    const fetchSupervisorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/supervisors/details/${employeeId}`);

        if (isMounted) {
          setEmployeeData(response?.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message || "Failed to fetch employee details",
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
  }, [employeeId]);

  return {
    employeeData,
    loading,
    error,
    activeTab,
    setActiveTab,
    activeRecord,
  };
}

const InfoCard = ({ label, value, isImage = false }) => (
  <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
      {label}
    </p>

    {isImage ? (
      value ? (
        <div className="mt-3 flex min-h-36 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white p-3">
          <img
            src={`http://localhost:4000${value.url}`}
            alt={label}
            className="max-h-28 w-full object-contain"
          />
        </div>
      ) : (
        <div className="mt-3 flex min-h-36 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-400">
          No Signature
        </div>
      )
    ) : (
      <p className="mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold leading-5 text-slate-900">
        {value || "N/A"}
      </p>
    )}
  </div>
);

export default function SupervisorDetailsViewing({ employeeId }) {
  const {
    employeeData,
    loading,
    error,
    activeTab,
    setActiveTab,
    activeRecord,
  } = useSupervisor(employeeId);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Supervisor Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while supervisor records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="h-1.5 bg-red-600" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to Load Supervisor Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
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
              No Supervisor Records Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No records are available for this employee.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                  Supervisor Details
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View supervisor-wise tasks, achievements, shortfalls,
                  category, place, signature, and record history.
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
            <span>Performance Appraisal</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Supervisor Details
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Reporting Officer Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a supervisor record to view complete employee details.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {employeeData?.map((record, index) => (
              <button
                type="button"
                key={record?._id}
                onClick={() => setActiveTab(index)}
                className={`min-w-[260px] rounded-md border p-3 text-left transition ${
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

                    <h3 className="mt-1 truncate text-sm font-bold">
                      {record?.reportingOfficerId?.firstName ||
                        record?.reportingOfficer}
                    </h3>

                    <p
                      className={`mt-1 truncate text-xs ${
                        activeTab === index
                          ? "text-blue-100"
                          : "text-slate-500"
                      }`}
                    >
                      {record?.department}
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      activeTab === index ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
                </div>

                <div
                  className={`mt-3 flex items-center justify-between border-t pt-3 text-xs ${
                    activeTab === index
                      ? "border-white/20 text-blue-100"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="font-semibold">{record?.financialYear}</span>

                  <span>Record #{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Supervisor Record
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  {activeRecord?.name || "Employee Details"}
                </h2>

                <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                  {activeRecord?.designation || "Designation not available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:min-w-[300px]">
                <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Financial Year
                  </p>

                  <p className="mt-1 text-base font-bold">
                    {activeRecord?.financialYear}
                  </p>
                </div>

                <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Category
                  </p>

                  <p className="mt-1 break-words text-sm font-bold">
                    {activeRecord?.category?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5 lg:p-6">
            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Basic Information
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Employee, designation, financial year, category, and place
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
                <InfoCard label="Employee Name" value={activeRecord?.name} />

                <InfoCard
                  label="Designation"
                  value={activeRecord?.designation}
                />

                <InfoCard
                  label="Financial Year"
                  value={activeRecord?.financialYear}
                />

                <InfoCard
                  label="Category"
                  value={activeRecord?.category?.name}
                />

                <InfoCard label="Place" value={activeRecord?.place} />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Performance Information
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Tasks, achievements, shortfalls, and higher achievements
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
                <InfoCard label="Tasks" value={activeRecord?.tasks} />

                <InfoCard
                  label="Achievements"
                  value={activeRecord?.achievements}
                />

                <InfoCard
                  label="Shortfalls"
                  value={activeRecord?.shortfalls}
                />

                <InfoCard
                  label="Higher Achievements"
                  value={activeRecord?.higherAchievements}
                />
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-12">
              <section className="rounded-lg border border-slate-200 bg-white lg:col-span-5">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Supervisor Signature
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Uploaded signature of the supervisor
                  </p>
                </div>

                <div className="p-4">
                  <InfoCard
                    label="Supervisor Signature"
                    value={activeRecord?.officerSignature}
                    isImage={true}
                  />
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white lg:col-span-7">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Record Timeline
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Record date, creation timestamp, and last update
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
                  <InfoCard
                    label="Date"
                    value={
                      activeRecord?.date
                        ? new Date(activeRecord.date).toLocaleDateString("en-IN")
                        : "N/A"
                    }
                  />

                  <InfoCard
                    label="Created At"
                    value={
                      activeRecord?.createdAt
                        ? new Date(activeRecord.createdAt).toLocaleString(
                            "en-IN"
                          )
                        : "N/A"
                    }
                  />

                  <InfoCard
                    label="Updated At"
                    value={
                      activeRecord?.updatedAt
                        ? new Date(activeRecord.updatedAt).toLocaleString(
                            "en-IN"
                          )
                        : "N/A"
                    }
                  />
                </div>
              </section>
            </div>
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Supervisor Record • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
}