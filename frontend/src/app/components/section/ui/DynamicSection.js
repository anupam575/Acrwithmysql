"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

// MUI ICONS
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DynamicSection = ({
  title,
  name,
  defaultItem = {},
  children,
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    if (!defaultItem) return;

    append(defaultItem);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0b4a7f]">
              Employee Appraisal Portal
            </p>
            <h2 className="mt-1 break-words text-lg font-bold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Add, update, or remove multiple records in this section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#0b4a7f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#083a64] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 sm:w-auto"
          >
            <AddIcon fontSize="small" />
            Add New Record
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Records Summary
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Total records currently added
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-700">Total</span>
            <span className="text-xl font-extrabold text-[#0b4a7f]">{fields.length}</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-xl font-extrabold text-[#0b4a7f]">0</div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No Records Available</h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              No entries have been added to this section. Use the
              <span className="mx-1 font-semibold text-[#0b4a7f]">Add New Record</span>
              button to create the first entry.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#0b4a7f] bg-white px-4 py-2 text-sm font-bold text-[#0b4a7f] transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
            >
              <AddIcon fontSize="small" />
              Add First Record
            </button>
          </div>
        )}

        {fields.length > 0 && (
          <div className="space-y-5">
            {fields.map((item, index) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0b4a7f] text-xs font-extrabold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#0b4a7f]">Record Entry</p>
                      <h3 className="mt-0.5 truncate text-sm font-bold text-slate-900">{title} {index + 1}</h3>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Active Record</span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid gap-4">{children(index)}</div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-xs text-slate-500">Review the information before removing this record.</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 sm:w-auto"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                    Remove Record
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Dynamic multi-record form section</span>
          <span className="font-semibold text-[#0b4a7f]">React Hook Form Connected</span>
        </div>
      </div>
    </section>
  );
};

export default DynamicSection;