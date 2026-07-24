"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import API from "../../../../../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import MasterDropdown from "../../../../components/section/ui/MasterDropdown";
import { useMasterData } from "../../../../components/hooks/useMasterData";

import {
  fetchRoles,
  fetchDepartments,
} from "../../../../../redux/slices/masterSlice";

import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  Shield,
  Building2,
  ArrowLeft,
  Save,
  UserCog,
} from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // ============================================
  // REACT HOOK FORM
  // ============================================
  const methods = useForm({
    defaultValues: {
      role: "",
      department: "",
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  // ============================================
  // MASTER DATA (REDUX)
  // ============================================
  const { roles, departments } = useMasterData();

  // ============================================
  // MASTER OBJECT
  // ============================================
  const master = {
    roles,
    departments,
  };

  // ============================================
  // STATES
  // ============================================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // STYLES
  // ============================================
  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700";

  const errorClass = "mt-2 text-xs font-medium text-red-600";

  // ============================================
  // FETCH MASTER DATA
  // ============================================
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // ============================================
  // FETCH USER
  // ============================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);

        const u = data.user;

        setUser(u);

        // ============================================
        // SET FORM VALUES
        // ============================================
        setValue("role", u?.role?._id || "");
        setValue("department", u?.department?._id || "");
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, setValue]);

  // ============================================
  // UPDATE USER
  // ============================================
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await API.put(`/users/${id}`, {
        roleId: data.role,
        departmentId: data.department,
      });

      toast.success("User updated successfully");

      setTimeout(() => {
        router.push("/admin/allusers");
      }, 800);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        <Toaster position="top-right" />

        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
          {/* ================= GOVERNMENT PORTAL HEADER ================= */}

          <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                    <UserCog className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                      User Administration
                    </p>

                    <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                      Update Officer Access
                    </h1>

                    <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                      Review officer information and update assigned role and
                      department.
                    </p>
                  </div>
                </div>

                <div className="w-fit rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Module
                  </p>
                  <p className="mt-1 text-sm font-bold">Officer Management</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
              <span>Home</span>
              <span>/</span>
              <span>Officer Management</span>
              <span>/</span>
              <span className="font-semibold text-blue-800">
                Update Officer Access
              </span>
            </div>
          </header>

          {/* ================= MAIN CONTENT ================= */}

          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* ================= OFFICER PROFILE ================= */}

            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
                    <User className="h-5 w-5 text-blue-800" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                      Officer Profile
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Existing account and organizational information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* PROFILE SUMMARY */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-800 text-2xl font-bold uppercase text-white shadow-md">
                      {user?.firstName?.charAt(0) || "U"}
                    </div>

                    <div className="mt-4 min-w-0 sm:ml-4 sm:mt-0">
                      <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                        {user?.firstName} {user?.lastName}
                      </h2>

                      <p className="mt-1 break-all text-sm text-slate-500">
                        @{user?.username}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                          user?.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {user?.isActive
                          ? "Active Officer"
                          : "Inactive Officer"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* INFORMATION GRID */}

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <div className="min-w-0 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50">
                        <Mail className="h-4 w-4 text-blue-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Email Address
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan-50">
                        <Phone className="h-4 w-4 text-cyan-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Phone Number
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {user?.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-50">
                        <User className="h-4 w-4 text-violet-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Officer Code
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {user?.empCode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50">
                        <BadgeCheck className="h-4 w-4 text-emerald-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Current Role
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {user?.role?.role_name || "No Role"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-slate-200 p-4 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-50">
                        <Building2 className="h-4 w-4 text-amber-700" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Current Department
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {user?.department?.department_name ||
                            "No Department"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= ACCESS FORM ================= */}

            <section className="min-w-0 overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100">
                    <Shield className="h-5 w-5 text-blue-800" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                      Role and Department Assignment
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Configure the officer&apos;s access and organizational
                      assignment.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex min-h-[420px] flex-col p-4 sm:p-6"
              >
                <div className="flex-1 space-y-5">
                  <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs leading-5 text-blue-900">
                      Select the appropriate role and department before saving.
                      These assignments control the officer&apos;s access and
                      workflow responsibilities.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Role</label>

                    <div className="min-w-0 rounded-md">
                      <MasterDropdown
                        master={master}
                        fields={[
                          {
                            name: "role",
                            optionsKey: "roles",
                            placeholder: "Select Role",
                          },
                        ]}
                      />
                    </div>

                    {errors.role && (
                      <p className={errorClass}>{errors.role.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Department</label>

                    <div className="min-w-0 rounded-md">
                      <MasterDropdown
                        master={master}
                        fields={[
                          {
                            name: "department",
                            optionsKey: "departments",
                            placeholder: "Select Department",
                          },
                        ]}
                      />
                    </div>

                    {errors.department && (
                      <p className={errorClass}>
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/allusers")}
                    disabled={loading}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Officer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
            Officer Access Management • Official Administration Portal
          </footer>
        </div>
      </div>
    </FormProvider>
  );
};

export default EditUser;