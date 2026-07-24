import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

function useSupervisor(employeeId, isActive) {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!isActive) return;

    if (!employeeId) {
      setError("Employee ID is required");
      return;
    }

    const fetchSupervisorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/supervisors/details/${employeeId}`
        );

        if (isMounted) {
          setEmployeeData(response?.data?.data ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ??
              "Failed to fetch employee details"
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
  }, [employeeId, isActive]);

  return {
    employeeData,
    loading,
    error,
  };
}

export default useSupervisor;