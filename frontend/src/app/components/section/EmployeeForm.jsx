"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

// ================= SINGLE SELECT =================
const Select = ({ name, options = [], placeholder }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1 w-full">

          <select
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              // ✅ SAFE HANDLING (important for Mongo ObjectId)
              field.onChange(value === "" ? null : value);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
            shadow-sm transition
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
          >
            <option value="">{placeholder}</option>

            {options?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

        </div>
      )}
    />
  );
};

// ================= MAIN COMPONENT =================
const Employeedropdown = ({ master, fields }) => {

  // 🔥 dynamic grid layout
  const gridClass =
    fields?.length === 1
      ? "grid-cols-1"
      : fields?.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-full">

      <div className={`grid ${gridClass} gap-5 w-full`}>

        {fields?.map((field, index) => (
          <Select
            key={`${field.name}-${index}`}   // ✅ better key stability
            name={field.name}
            options={master?.[field.optionsKey] || []}  // ✅ safe fallback
            placeholder={field.placeholder}
          />
        ))}

      </div>

    </div>
  );
};

export default Employeedropdown;