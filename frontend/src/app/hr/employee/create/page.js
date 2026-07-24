"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Info,
  Layers3,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { fetchCategories } from "../../../../redux/slices/masterSlice";
import EmployeePage from "../../../components/section/Employee";
import PARForm from "../../../components/section/Par";

const FORM_TYPE = {
  PAR: "PAR",
  EMPLOYEE: "EMPLOYEE",
};

const CombinedPage = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.master);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeForm, setActiveForm] = useState(null);

  const { control, reset } = useForm({
    defaultValues: { category: "" },
  });

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ================= FORM TYPE BASED ON category_key =================
  const getFormType = (categoryKey) => {
  const map = {
    "senior and top managerial level": FORM_TYPE.PAR,
    "supervisory and below supervisory category employees":
      FORM_TYPE.EMPLOYEE,
  };

  return map[categoryKey] || FORM_TYPE.EMPLOYEE;
};
   

  const categoryOptions = useMemo(() => categories || [], [categories]);

  // ================= SELECT CATEGORY =================
  const handleCategorySelect = (categoryId) => {
    const cat = categories?.find((c) => c._id === categoryId);

    if (!cat) return;

    console.log("SELECTED CATEGORY:", cat);
    console.log("CATEGORY KEY:", cat.category_key);

    setSelectedCategory(cat);

    const formType = getFormType(cat.category_key);

    console.log("FORM TYPE:", formType);

    setActiveForm(formType);
  };

  // ================= BACK =================
  const handleBack = () => {
    setActiveForm(null);
    setSelectedCategory(null);
    reset({ category: "" });
  };

  const selectedFormLabel =
    activeForm === FORM_TYPE.PAR
      ? "PAR Form"
      : activeForm === FORM_TYPE.EMPLOYEE
        ? "Officer Appraisal Form"
        : "Category Selection";

  return (
    <div className="min-h-screen bg-[#eef3f8] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* PAGE HEADER */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#0b4a7f] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Annual Performance Appraisal Report
                </p>

                <h1 className="mt-2 text-xl font-bold sm:text-2xl">
                  Appraisal Category Selection
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Select the applicable officer category to continue with the
                  correct appraisal workflow and form structure.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Available Categories
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {categoryOptions.length}
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Current Stage
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {selectedFormLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500 sm:px-8">
            <span>Home</span>
            <span>/</span>
            <span>APAR Management</span>
            <span>/</span>
            <span className="font-semibold text-[#0b4a7f]">
              {activeForm ? selectedFormLabel : "Category Selection"}
            </span>
          </div>
        </section>

        {/* WORKFLOW STEPS */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <StepCard
              step="01"
              title="Select Appraisal Category"
              description="Choose the category that matches the officer level."
              active={!activeForm}
              completed={Boolean(activeForm)}
            />

            <StepCard
              step="02"
              title="Complete Appraisal Form"
              description="Fill and submit the form assigned to the selected category."
              active={Boolean(activeForm)}
              completed={false}
            />
          </div>
        </section>

        {/* CATEGORY SECTION */}
        {!activeForm && (
          <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
                  <Layers3 size={23} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                    Select Appraisal Category
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    The selected category determines which appraisal form will
                    be displayed.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <label
                htmlFor="category"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
              >
                Officer Category
              </label>

              <div className="relative">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="category"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleCategorySelect(e.target.value);
                      }}
                      className="min-h-12 w-full appearance-none rounded-md border border-slate-300 bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0b4a7f] focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select Category</option>

                      {categoryOptions.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                />

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <InfoPanel
                  icon={<ClipboardList size={20} />}
                  title="Senior and Top Managerial Level"
                  description="Opens the PAR workflow for senior and top managerial officers."
                />

                <InfoPanel
                  icon={<UsersRound size={20} />}
                  title="Supervisory and Below"
                  description="Opens the officer appraisal workflow for supervisory and other categories."
                />
              </div>

              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-[#0b4a7f]"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Category Mapping
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      The system automatically identifies the appropriate form
                      using the selected category key. No manual form selection
                      is required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Secure category verification enabled
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#0b4a7f]">
                  <ShieldCheck size={16} />
                  Appraisal Management System
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FORM SECTION */}
        {activeForm && (
          <div className="space-y-5">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <UserRoundCheck size={22} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Selected Category
                      </p>

                      <h2 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                        {selectedCategory?.name || "N/A"}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        The system selected the applicable appraisal workflow
                        based on this category.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#0b4a7f] sm:w-fit"
                  >
                    Change Category
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
                <DetailCard
                  icon={<Layers3 size={18} />}
                  label="Category"
                  value={selectedCategory?.name}
                />

                <DetailCard
                  icon={<Building2 size={18} />}
                  label="Category Key"
                  value={selectedCategory?.category_key}
                />

                <DetailCard
                  icon={<ClipboardList size={18} />}
                  label="Assigned Form"
                  value={selectedFormLabel}
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-[#0b4a7f] px-4 py-4 text-white sm:px-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} />

                  <div>
                    <h2 className="text-sm font-bold sm:text-base">
                      {selectedFormLabel}
                    </h2>

                    <p className="mt-1 text-xs text-blue-100">
                      Complete all applicable sections before submitting the
                      appraisal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-hidden">
                {activeForm === FORM_TYPE.PAR ? (
                  <PARForm handleBack={handleBack} />
                ) : (
                  <EmployeePage handleBack={handleBack} />
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

function StepCard({ step, title, description, active, completed }) {
  return (
    <div
      className={`rounded-lg border p-4 transition ${
        active
          ? "border-[#0b4a7f] bg-blue-50"
          : completed
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
            active
              ? "bg-[#0b4a7f] text-white"
              : completed
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-600"
          }`}
        >
          {completed ? <CheckCircle2 size={18} /> : step}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ icon, title, description }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[#0b4a7f]">{icon}</div>

        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[#0b4a7f]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-900">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CombinedPage;