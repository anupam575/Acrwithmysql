"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import API from "../../../../../utils/axiosInstance";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const UpdateCategory = () => {
  const { id } = useParams();
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setFetchLoading(true);

      try {
        const { data } = await API.get(`/category/${id}`);

        setCategoryName(data.category.name);
        setOriginalName(data.category.name);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load category",
        );

        router.push("/admin/category");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    const trimmed = categoryName.trim();

    if (!trimmed) {
      return toast.error("Category name cannot be empty!");
    }

    if (trimmed === originalName) {
      return toast.error("No changes detected");
    }

    setLoading(true);

    try {
      await API.put(`/category/${id}`, {
        name: trimmed,
      });

      toast.success("Category updated successfully 🎉");

      setTimeout(() => {
        router.push("/admin/create-category");
      }, 800);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update category",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">
        {/* ================= HEADER ================= */}

        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                  <CategoryIcon className="!text-2xl !text-white sm:!text-3xl" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Category Administration
                  </p>

                  <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                    Update Category
                  </h1>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Modify an existing category while keeping the category
                    master accurate and consistent.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                  Record Status
                </p>

                <p className="mt-1 text-sm font-bold">
                  Edit Mode
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Category Management</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Update Category
            </span>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                <CategoryIcon className="!text-xl !text-blue-800" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Category Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Review the existing value and enter the updated category name.
                </p>
              </div>
            </div>
          </div>

          {fetchLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
              <AccessTimeIcon className="!text-4xl !text-blue-800" />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Loading category details...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Please wait while the category record is being retrieved.
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                {/* ================= FORM ================= */}

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
                    value={categoryName}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    disabled={loading}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Enter a clear and unique category name. Leading and trailing
                    spaces will be removed automatically.
                  </p>
                </div>

                {/* ================= CURRENT VALUE ================= */}

                <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Current Category
                  </p>

                  <p className="mt-2 break-words text-sm font-bold text-slate-900">
                    {originalName || "N/A"}
                  </p>

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs leading-5 text-slate-500">
                      Make a change before submitting. The system will prevent
                      saving an unchanged value.
                    </p>
                  </div>
                </aside>
              </div>

              {/* ================= BUTTONS ================= */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/admin/category")}
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
                      Update Category
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Category Master Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default UpdateCategory;