"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../../utils/axiosInstance";
import CategoryList from "../../components/section/Allcategory";

import CategoryIcon from "@mui/icons-material/Category";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/category/create", { name: trimmed });

      toast.success("Category created successfully 🎉");

      setName("");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create category",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        {/* ================= HEADER ================= */}

        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                  <CategoryIcon className="!text-2xl !text-white sm:!text-3xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Master Data Administration
                  </p>

                  <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                    Category Management
                  </h1>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Create new categories and manage existing category master
                    records from one central screen.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Module
                </p>

                <p className="mt-1 text-sm font-bold">
                  Category Master
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Master Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Category Management
            </span>
          </div>
        </header>

        {/* ================= CREATE FORM ================= */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                <AddCircleOutlinedIcon className="!text-xl !text-blue-800" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Create New Category
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Enter a unique category name and save it to the category
                  master.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 lg:p-6"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use a clear and meaningful category name. Leading and trailing
                  spaces will be removed automatically.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
              >
                {loading ? (
                  <>
                    <AccessTimeIcon
                      fontSize="small"
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <AddCircleOutlinedIcon fontSize="small" />
                    Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ================= CATEGORY LIST ================= */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Category Directory
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Review, update and manage all available categories.
            </p>
          </div>

          <div className="min-w-0 p-3 sm:p-4 lg:p-5">
            <CategoryList key={refreshKey} />
          </div>
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Category Master Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default CreateCategory;