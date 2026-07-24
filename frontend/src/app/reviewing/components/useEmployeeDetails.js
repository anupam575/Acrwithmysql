import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function useEmployeeDetails(employeeId) {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/self-appraisal/views/${employeeId}`);

        console.log("API Response:", response.data);

        setEmployeeData(response?.data?.data || []);
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message || "Failed to fetch employee details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  return {
    employeeData,
    loading,
    error,
  };
}
