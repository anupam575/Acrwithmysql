import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

function useSupervisor(employeeId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!employeeId) {
      setError("Officer ID is required");
      return;
    }

    const fetchSupervisorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🚀 Fetching Officer Details:", employeeId);

        const response = await API.get(
          `/supervisors/view/${employeeId}`,
        );

        console.log("✅ API RESPONSE:", response?.data);

        if (isMounted) {
          setEmployeeData(response?.data?.data ?? null);
        }
      } catch (err) {
        console.error("❌ API ERROR:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message ??
              "Failed to fetch officer details",
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

  return { employeeData, loading, error };
}

export default function SupervisorDetailsViewing({ employeeId }) {
  const { employeeData, loading, error } =
    useSupervisor(employeeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            <div className="flex items-center gap-4 p-6 sm:p-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Loading Officer Data
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Please wait while the appraisal record is being retrieved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-red-200 bg-white text-center shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            <div className="p-6 sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-700">
                !
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-center shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">
                No Officer Data Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Officer appraisal details are not available.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const employeeFields = [
    {
      label: "Officer Name",
      value: employeeData?.name,
    },
    {
      label: "Financial Year",
      value: employeeData?.financialYear,
    },
    {
      label: "Tasks",
      value: employeeData?.tasks,
    },
    {
      label: "Achievements",
      value: employeeData?.achievements,
    },
    {
      label: "Shortfalls",
      value: employeeData?.shortfalls,
    },
    {
      label: "Higher Achievements",
      value: employeeData?.higherAchievements,
    },
    {
      label: "Place",
      value: employeeData?.place,
    },
    {
      label: "Date",
      value: employeeData?.date
        ? new Date(employeeData.date).toLocaleDateString("en-IN")
        : null,
    },
    {
      label: "Created At",
      value: employeeData?.createdAt
        ? new Date(employeeData.createdAt).toLocaleString("en-IN")
        : null,
    },
    {
      label: "Updated At",
      value: employeeData?.updatedAt
        ? new Date(employeeData.updatedAt).toLocaleString("en-IN")
        : null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Supervisor Assessment
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Officer Self-Appraisal Details
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Review the officer&apos;s self-appraisal, declared
                  achievements, shortfalls and submitted signature.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Financial Year
                </p>
                <p className="mt-1 text-sm font-bold">
                  {employeeData?.financialYear || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Supervisor</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Officer Self-Appraisal
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900">
              Officer Appraisal Information
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Submitted appraisal information for supervisor review.
            </p>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {employeeFields.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
                  {item.value ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900">
              Officer Signature
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Signature submitted by the officer reported upon.
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mx-auto flex min-h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
              {employeeData?.officerSignature?.url ? (
                <img
                  src={`http://localhost:4000${employeeData.officerSignature.url}`}
                  alt="Officer Signature"
                  className="max-h-44 w-auto max-w-full object-contain"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-400">
                  Signature Not Available
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Supervisor Review of Officer Self-Appraisal • Official Administration Portal
        </footer>
      </div>
    </div>
  );
}