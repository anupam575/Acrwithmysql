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
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
    <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
      {label}
    </p>

    {isImage ? (
      value ? (
        <div className="mt-4 flex justify-center">
          <img
            src={`http://localhost:4000${value.url}`}
            alt={label}
            className="h-36 w-full rounded-lg border object-contain bg-slate-50 p-2"
          />
        </div>
      ) : (
        <p className="mt-4 text-slate-400">No Signature</p>
      )
    ) : (
      <p className="mt-3 text-slate-900 font-semibold break-words">
        {value || "N/A"}
      </p>
    )}
  </div>
);
export default function SupervisorDetailsView({ employeeId }) {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading Supervisor Details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 px-8 py-6 rounded-2xl shadow">
          {error}
        </div>
      </div>
    );
  }

  if (!employeeData?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No Supervisor Records Found
          </h2>

          <p className="text-slate-500 mt-2">
            No records available for this employee.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="space-y-8">
          {/* REPORTING OFFICER TABS */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-200">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {employeeData?.map((record, index) => (
                <button
                  key={record?._id}
                  onClick={() => setActiveTab(index)}
                  className={`min-w-[280px] p-5 rounded-2xl text-left transition-all duration-300 border ${
                    activeTab === index
                      ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white border-transparent shadow-xl scale-105"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        {record?.reportingOfficerId?.firstName ||
                          record?.reportingOfficer}
                      </h3>

                      <p
                        className={`text-sm mt-1 ${
                          activeTab === index
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {record?.department}
                      </p>
                    </div>

                    <div
                      className={`w-3 h-3 rounded-full ${
                        activeTab === index ? "bg-green-400" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        activeTab === index ? "bg-white/10" : "bg-slate-100"
                      }`}
                    >
                      {record?.financialYear}
                    </span>

                    <span
                      className={`text-xs ${
                        activeTab === index
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      Record #{index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-5">
              Supervisor Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <InfoCard label="Employee Name" value={activeRecord?.name} />

              <InfoCard label="Designation" value={activeRecord?.designation} />

              <InfoCard
                label="Financial Year"
                value={activeRecord?.financialYear}
              />

              <InfoCard label="Tasks" value={activeRecord?.tasks} />

              <InfoCard
                label="Achievements"
                value={activeRecord?.achievements}
              />

              <InfoCard label="Shortfalls" value={activeRecord?.shortfalls} />

              <InfoCard
                label="Higher Achievements"
                value={activeRecord?.higherAchievements}
              />

              <InfoCard label="Place" value={activeRecord?.place} />


              <InfoCard label="Category" value={activeRecord?.category?.name} />
<InfoCard
  label="Supervisor Signature"
  value={activeRecord?.officerSignature}
  isImage={true}
/>
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
                    ? new Date(activeRecord.createdAt).toLocaleString("en-IN")
                    : "N/A"
                }
              />

              <InfoCard
                label="Updated At"
                value={
                  activeRecord?.updatedAt
                    ? new Date(activeRecord.updatedAt).toLocaleString("en-IN")
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
