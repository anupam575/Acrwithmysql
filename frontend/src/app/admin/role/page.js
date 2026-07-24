"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../../utils/axiosInstance";
import AllRole from "../../components/section/Allrole";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChange = (e) => setRoleName(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = roleName.trim();

    if (!trimmed) {
      toast.error("Role name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/roles/create", {
        role_name: trimmed,
      });

      if (res.data.success) {
        toast.success("Role created successfully 🎉");
        setRoleName("");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 md:px-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-5">

        <header className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="bg-[#0b3a6f] p-6 text-white flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
                <AdminPanelSettingsIcon className="!text-3xl"/>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-200">Administration</p>
                <h1 className="text-2xl font-bold">Role Management</h1>
                <p className="text-sm text-blue-100">Create and manage system roles.</p>
              </div>
            </div>
            <div className="rounded-md border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-xs text-blue-200 uppercase">Module</p>
              <p className="font-semibold">Role Master</p>
            </div>
          </div>
        </header>

        <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-slate-50 px-5 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
              <AddCircleOutlinedIcon className="!text-blue-800"/>
            </div>
            <div>
              <h2 className="font-bold">Create New Role</h2>
              <p className="text-xs text-slate-500">Add a new role to the master.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 grid gap-4 lg:grid-cols-[1fr_auto] items-end">
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter role name..."
                className="h-11 w-full rounded-md border border-slate-300 px-3 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-800 px-6 font-bold text-white hover:bg-blue-900 disabled:opacity-60">
              {loading ? (
                <>
                  <AccessTimeIcon className="animate-spin" fontSize="small"/>
                  Creating...
                </>
              ) : (
                <>
                  <AddCircleOutlinedIcon fontSize="small"/>
                  Create Role
                </>
              )}
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-slate-50 px-5 py-4">
            <h2 className="font-bold">Role Directory</h2>
            <p className="text-xs text-slate-500">View and manage all roles.</p>
          </div>

          <div className="p-4">
            <AllRole key={refreshKey} />
          </div>
        </section>

      </div>
    </div>
  );
};

export default CreateRole;