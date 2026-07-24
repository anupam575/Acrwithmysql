"use client";

import React, { useEffect, useState, useMemo } from "react";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import ActionDropdown from "../../components/section/ui/ActionDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const DepartmentList = ({ refreshKey }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);

    try {
      const res = await API.get("/departments/all");
      setDepartments(res?.data?.departments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [refreshKey]);

  const updateDepartment = (id) =>
    (window.location.href = `/admin/department/edit/${id}`);

  const viewDepartment = (id) =>
    (window.location.href = `/admin/department/${id}`);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this department?");
    if (!confirmDelete) return;

    const backup = [...departments];
    setDepartments((prev) => prev.filter((d) => d._id !== id));

    try {
      await API.delete(`/departments/${id}`);
      toast.success("Deleted successfully");
    } catch (err) {
      setDepartments(backup);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const rows = useMemo(
    () =>
      departments.map((d, index) => (
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
                {d.department_name?.charAt(0) || "D"}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {d.department_name || "N/A"}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Department Master Record
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
                  onUpdate={() => updateDepartment(d._id)}
                  onView={() => viewDepartment(d._id)}
                  onDelete={() => handleDelete(d._id)}
                />
              </div>
            </div>
          </td>
        </tr>
      )),
    [departments],
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
              <AccountTreeIcon className="!text-xl !text-blue-800" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Department List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                View and manage all department master records.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs text-slate-500">
              Total Departments
            </span>

            <span className="ml-2 text-sm font-bold text-slate-900">
              {departments.length}
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
            Loading departments...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please wait while department records are being retrieved.
          </p>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading && departments.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <AccountTreeIcon className="!text-3xl !text-slate-400" />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            No Departments Found
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Department records will appear here after a department is created.
          </p>
        </div>
      ) : (
        !loading && (
          <>
            {/* ================= DESKTOP / TABLET ================= */}

            <div className="md:block">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0b3a6f] text-white">
                    <th className="w-16 border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      #
                    </th>

                    <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      Department
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
              {departments.map((d, index) => (
                <article
                  key={d._id}
                  className=" rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-800">
                        {d.department_name?.charAt(0) || "D"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {d.department_name || "N/A"}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Department #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                      <ActionDropdown
                        onUpdate={() => updateDepartment(d._id)}
                        onView={() => viewDepartment(d._id)}
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

export default DepartmentList;