"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";

export default function useAppraisals(page, setPage, limit, search) {
  const router = useRouter();

  const [appraisals, setAppraisals] = useState([]);
  const [filteredAppraisals, setFilteredAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchAppraisals();
  }, []);

  const fetchAppraisals = async () => {
    try {
      setLoading(true);

      const response = await API.get("/self-appraisal/all");

      const data = response?.data?.data || [];
      setAppraisals(data);

    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed To Fetch Appraisals");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH + PAGINATION ================= */
  useEffect(() => {
    let filtered = [...appraisals];

    if (search) {
      filtered = filtered.filter((item) =>
        item?.responsibilities?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const pages = Math.ceil(filtered.length / limit);
    setTotalPages(pages > 0 ? pages : 1);

    if (page > pages && pages > 0) {
      setPage(1);
      return;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    setFilteredAppraisals(filtered.slice(startIndex, endIndex));
  }, [search, appraisals, page, limit, setPage]);

  /* ================= UPDATE ================= */
  const handleUpdate = (appraisal) => {
    const id = appraisal?._id;

    if (!id) {
      alert("Invalid ID");
      return;
    }

    router.push(`/employee/allapprisal/update/${id}`);
  };

  /* ================= VIEW (FINAL FIX) ================= */
  const handleView = (appraisal) => {
    const appraisalId = appraisal?._id; // ✅ ONLY APPRAISAL ID

    console.log("VIEW APPRAISAL ID:", appraisalId);

    if (!appraisalId) {
      alert("Appraisal ID not found");
      return;
    }

    router.push(`/employee/allapprisal/view/${appraisalId}`);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (appraisal) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this appraisal?"
      );

      if (!confirmDelete) return;

      setLoading(true);

      const response = await API.delete(
        `/self-appraisal/delete/${appraisal._id}`
      );

      if (response?.data?.success) {
        alert("Self Appraisal Deleted Successfully");

        const updatedList = appraisals.filter(
          (item) => item._id !== appraisal._id
        );

        setAppraisals(updatedList);
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed To Delete Appraisal");
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredAppraisals,
    loading,
    totalPages,
    handleUpdate,
    handleView,
    handleDelete,
  };
}