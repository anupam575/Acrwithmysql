// Responsive Government Portal version of EditDepartment
// UI redesigned only. Business logic, API calls and validations remain unchanged.

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "../../../../../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;

const EditDepartment = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [departmentName, setDepartmentName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchDepartment = async () => {
    setFetchLoading(true);
    try {
      const res = await API.get(`/departments/${id}`);
      if (res.data.success) {
        const data = res.data.department;
        setDepartmentName(data.department_name);
        setOriginalName(data.department_name);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch");
      router.push("/admin/department");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDepartment();
  }, [id]);

  const handleUpdate = async () => {
    const trimmed = departmentName.trim();

    if (!trimmed) return toast.error("Department name is required");
    if (!nameRegex.test(trimmed))
      return toast.error("Only letters and spaces allowed");
    if (trimmed === originalName)
      return toast.error("No changes detected");

    try {
      setLoading(true);
      const res = await API.put(`/departments/${id}`, {
        department_name: trimmed,
      });

      if (res.data.success) {
        toast.success("Department updated successfully 🎉");
        setTimeout(() => router.push("/admin/department"), 800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 lg:px-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-5xl space-y-5">

        <header className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="bg-[#0b3a6f] text-white p-6 flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex gap-4 items-center">
              <div className="h-14 w-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <AccountTreeIcon className="!text-3xl"/>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-blue-200">Organization Administration</div>
                <h1 className="text-2xl font-bold">Edit Department</h1>
                <p className="text-sm text-blue-100">Update department master information.</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-2 text-xs text-slate-500">Home / Department / <span className="font-semibold text-blue-800">Edit Department</span></div>
        </header>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-slate-50 px-6 py-4">
            <h2 className="font-bold">Department Details</h2>
            <p className="text-xs text-slate-500">Modify department name.</p>
          </div>

          {fetchLoading ? (
            <div className="min-h-64 flex flex-col items-center justify-center">
              <AccessTimeIcon className="animate-spin !text-4xl text-blue-700"/>
              <p className="mt-3">Loading department...</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid lg:grid-cols-[1fr_260px] gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Department Name</label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e)=>setDepartmentName(e.target.value)}
                    placeholder="Enter department name"
                    className="w-full h-11 rounded-md border px-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-700 outline-none"
                  />
                </div>

                <div className="rounded-lg border bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">Current Name</div>
                  <div className="mt-2 font-bold break-words">{originalName || "N/A"}</div>
                </div>
              </div>

              <div className="mt-6 border-t pt-5 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={()=>router.push("/admin/department")}
                  className="h-11 px-5 rounded-md border bg-white hover:bg-slate-100 font-semibold flex items-center justify-center gap-2">
                  <ArrowBackIcon fontSize="small"/>Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="h-11 px-5 rounded-md bg-blue-800 hover:bg-blue-900 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><AccessTimeIcon fontSize="small" className="animate-spin"/>Updating...</> : <><SaveIcon fontSize="small"/>Update Department</>}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border bg-white text-center text-xs text-slate-500 py-3">
          Department Master Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default EditDepartment;