"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "../../../../../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const EditDesignation = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // ================= FETCH SINGLE =================
  const fetchDesignation = async () => {
    setFetchLoading(true);

    try {
      const res = await API.get(`/designations/${id}`);

      if (res.data.success) {
        const data = res.data.designation;

        setName(data.name);
        setOriginalName(data.name);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch");

      router.push("/admin/designation");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDesignation();
    }
  }, [id]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      return toast.error("Designation name is required");
    }

    if (trimmed === originalName) {
      return toast.error("No changes detected");
    }

    try {
      setLoading(true);

      const res = await API.put(`/designations/${id}`, {
        name: trimmed,
      });

      if (res.data.success) {
        toast.success("Designation updated successfully 🎉");

        setTimeout(() => {
          router.push("/admin/designation");
        }, 800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">
        {/* ================= PORTAL HEADER ================= */}

        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                  <BadgeIcon className="!text-2xl sm:!text-3xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Organizational Administration
                  </p>

                  <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                    Edit Designation
                  </h1>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Update the selected designation master record.
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Module
                </p>
                <p className="mt-1 text-sm font-bold">Designation Master</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Designation Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Edit Designation
            </span>
          </div>
        </header>

        {/* ================= EDIT SECTION ================= */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
                <BadgeIcon className="!text-xl !text-blue-800" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Designation Details
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Modify the designation name and save your changes.
                </p>
              </div>
            </div>
          </div>

          {fetchLoading ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <AccessTimeIcon className="animate-spin !text-3xl !text-blue-800" />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">
                Loading designation...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Please wait while the designation record is retrieved.
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                {/* FORM AREA */}

                <div>
                  <label
                    htmlFor="designation-name"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
                  >
                    Designation Name
                  </label>

                  <input
                    id="designation-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter designation name"
                    disabled={loading}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2.5">
                    <InfoOutlinedIcon className="!mt-0.5 !text-base !text-blue-700" />

                    <p className="text-xs leading-5 text-blue-900">
                      Enter a clear designation title. Saving without changing
                      the existing value will show a validation message.
                    </p>
                  </div>
                </div>

                {/* CURRENT VALUE */}

                <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Current Designation
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <BadgeIcon className="!text-xl !text-blue-800" />
                    </div>

                    <p className="min-w-0 break-words text-sm font-bold text-slate-900">
                      {originalName || "N/A"}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Record Status
                    </p>

                    <span className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      Available for Update
                    </span>
                  </div>
                </aside>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/admin/designation")}
                  disabled={loading}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <ArrowBackIcon fontSize="small" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <AccessTimeIcon
                        fontSize="small"
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <SaveIcon fontSize="small" />
                      Update Designation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Designation Master Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default EditDesignation;