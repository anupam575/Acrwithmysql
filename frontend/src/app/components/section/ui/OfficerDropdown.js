import React from "react";
import { Controller } from "react-hook-form";

const OfficerDropdown = ({
  label,
  name,
  control,
  options = [],
  loading = false,
  placeholder = "Select option",
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value ?? ""}   // ✅ FIX: prevent null crash
            onChange={(e) => field.onChange(e.target.value)} // ✅ ensure string value
            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                       bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {loading ? "Loading..." : placeholder}
            </option>

            {options.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

export default OfficerDropdown;