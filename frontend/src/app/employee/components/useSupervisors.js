"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";

export default function useSupervisors(
  page,
  setPage,
  limit,
  search
) {
  const router = useRouter();

  const [supervisors, setSupervisors] = useState([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);

      const response = await API.get("/supervisors/all");

      const data = response?.data?.data || [];

      setSupervisors(data);
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed To Fetch Supervisors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...supervisors];

    // Search by Reporting Officer Name
    if (search) {
      filtered = filtered.filter((item) =>
        item?.reportingOfficerId?.firstName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    const pages = Math.ceil(filtered.length / limit);

    setTotalPages(pages || 1);

    if (page > pages && pages > 0) {
      setPage(1);
      return;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    setFilteredSupervisors(
      filtered.slice(startIndex, endIndex)
    );
  }, [search, supervisors, page, limit, setPage]);

  // ================= UPDATE =================
  // _id = appraisalId
  const handleUpdate = (item) => {
    const appraisalId = item._id;

    router.push(
      `/employee/allapprisal/update/${appraisalId}`
    );
  };

  // ================= VIEW =================
  // _id = appraisalId
  const handleView = (item) => {
    const appraisalId = item._id;

    router.push(
      `/employee/supervisor/view/${appraisalId}`
    );
  };

  // ================= DELETE =================
  const handleDelete = async (item) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this supervisor?"
      );

      if (!confirmDelete) return;

      setLoading(true);

      const response = await API.delete(
        `/supervisors/delete/${item._id}`
      );

      if (response?.data?.success) {
        setSupervisors((prev) =>
          prev.filter((x) => x._id !== item._id)
        );

        alert("Supervisor Deleted Successfully");
      }
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed To Delete Supervisor"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredSupervisors,
    loading,
    totalPages,
    handleUpdate,
    handleView,
    handleDelete,
  };
}