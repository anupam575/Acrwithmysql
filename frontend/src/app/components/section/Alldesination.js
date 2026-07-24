"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import ActionDropdown from "../../components/section/ui/ActionDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";

const DesignationList = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchDesignations = async () => {
    setLoading(true);

    try {
      const res = await API.get("/designations/get");
      setDesignations(res.data.designations || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const updateDesignation = (id) =>
    router.push(`/admin/designation/edit/${id}`);

  const viewDesignation = (id) =>
    router.push(`/admin/designation/${id}`);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this designation?");
    if (!confirmDelete) return;

    const original = [...designations];
    setDesignations((prev) => prev.filter((d) => d._id !== id));

    try {
      await API.delete(`/designations/${id}`);
      toast.success("Deleted successfully");
    } catch (err) {
      setDesignations(original);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const rows = useMemo(
    () =>
      designations.map((d, index) => (
        <tr
          key={d._id}
          className="border-b border-slate-200 odd:bg-white even:bg-slate-50 transition hover:bg-blue-50"
        >
          <td className="w-16 border-r border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            {index + 1}
          </td>

          <td className="border-r border-slate-200 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-800">
                {d.name?.charAt(0) || "D"}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {d.name || "N/A"}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Designation Master Record
                </p>
              </div>
            </div>
          </td>

          <td className="border-r border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <AccessTimeIcon
                sx={{ fontSize: 17 }}
                className="!shrink-0 !text-slate-400"
              />

              <span className="break-words">
                {new Date(d.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
          </td>

          <td className="w-28 px-4 py-3 text-center">
            <div className="flex justify-center">
              <div className="rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                <ActionDropdown
                  onUpdate={() => updateDesignation(d._id)}
                  onView={() => viewDesignation(d._id)}
                  onDelete={() => handleDelete(d._id)}
                />
              </div>
            </div>
          </td>
        </tr>
      )),
    [designations],
  );

  return (
    <div className="w-full min-w-0  rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
              <BadgeIcon className="!text-xl !text-blue-800" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Designation List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                View and manage all designation master records.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs text-slate-500">
              Total Designations
            </span>

            <span className="ml-2 text-sm font-bold text-slate-900">
              {designations.length}
            </span>
          </div>
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />

          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AccessTimeIcon fontSize="small" />
            Loading designations...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please wait while designation records are being retrieved.
          </p>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading && designations.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <BadgeIcon className="!text-3xl !text-slate-400" />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            No Designations Found
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Designation records will appear here after a designation is
            created.
          </p>
        </div>
      ) : (
        !loading && (
          <>
            {/* ================= DESKTOP / TABLET ================= */}

            <div className="hidden md:block">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0b3a6f] text-white">
                    <th className="w-16 border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      #
                    </th>

                    <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Designation
                    </th>

                    <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Created At
                    </th>

                    <th className="w-28 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>{rows}</tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}

            <div className="grid gap-3 p-3 md:hidden">
              {designations.map((d, index) => (
                <article
                  key={d._id}
                  className="overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-800">
                        {d.name?.charAt(0) || "D"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {d.name || "N/A"}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Designation #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                      <ActionDropdown
                        onUpdate={() => updateDesignation(d._id)}
                        onView={() => viewDesignation(d._id)}
                        onDelete={() => handleDelete(d._id)}
                      />
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Created At
                    </p>

                    <div className="mt-1.5 flex items-start gap-2 text-sm font-medium leading-5 text-slate-800">
                      <AccessTimeIcon
                        sx={{ fontSize: 17 }}
                        className="!mt-0.5 !shrink-0 !text-slate-400"
                      />

                      <span className="break-words">
                        {new Date(d.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default DesignationList;