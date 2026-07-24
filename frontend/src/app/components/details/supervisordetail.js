import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

/**
 * =========================
 * CUSTOM HOOK
 * =========================
 */
function useSupervisor(employeeId) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

        console.log("🚀 Fetching Employee Details:", employeeId);

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
              "Failed to fetch employee details",
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
  };
}

/**
 * =========================
 * COMPONENT
 * =========================
 */
export default function SupervisorDetailsViewsus({ employeeId }) {
  const { employeeData, loading, error } =
    useSupervisor(employeeId);

  /**
   * =========================
   * LOADING
   * =========================
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

            <div>
              <h2 className="font-semibold text-lg">
                Loading Employee Data
              </h2>

              <p className="text-sm text-gray-500">
                Please wait...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * =========================
   * ERROR
   * =========================
   */
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

  /**
   * =========================
   * NO DATA
   * =========================
   */
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

  const employeeFields = [
    {
      label: " Name",
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
      label: "Signature",
      value: employeeData?.signature,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Employee Self Appraisal Details
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {employeeFields.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-500">
                      {item.label}
                    </p>

                    <h3 className="text-gray-900 font-semibold mt-2 break-words">
                      {item.value ?? "N/A"}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}