"use client";

import { Controller } from "react-hook-form";

export default function DesignationDropdown({
  control,
  designations = [],
  name = "designation",
  label = "Designation",
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field, fieldState }) => (
          <>
            <select
              {...field}
              disabled={disabled}
              className="border px-3 py-2 rounded-md"
            >
              <option value="">Select {label}</option>

              {designations.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            {fieldState.error && (
              <p className="text-red-500 text-sm">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}