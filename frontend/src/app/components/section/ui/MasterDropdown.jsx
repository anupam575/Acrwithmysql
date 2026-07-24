"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const Select = ({ name, options, placeholder }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full min-w-0">
          <div className="relative">
            <select
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || "")}
              className="
                block
                h-11
                w-full
                min-w-0
                appearance-none
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                pr-10
                text-sm
                font-medium
                text-slate-800
                shadow-sm
                outline-none
                transition
                hover:border-slate-400
                focus:border-blue-700
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-100
                disabled:text-slate-500
              "
            >
              <option value="" className="bg-white text-slate-500">
                {placeholder}
              </option>

              {options?.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  className="bg-white text-slate-800"
                >
                  {item.role_name || item.department_name || item.name}
                </option>
              ))}
            </select>

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-3
                flex
                items-center
                text-slate-500
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      )}
    />
  );
};

const MasterDropdown = ({ master, fields }) => {
  return (
    <div className="w-full min-w-0">
      <div className="grid w-full grid-cols-1 gap-5">
        {fields?.map((field, index) => (
          <Select
            key={index}
            name={field.name}
            options={master?.[field.optionsKey]}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterDropdown;