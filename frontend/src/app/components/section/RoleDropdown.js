"use client";

import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

export default function RoleDropdown({
  control,
  roles = [],
  name = "role",
  label = "Role",
  disabled = false,
}) {
  return (
    <div className="w-full">

      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} is required`,
        }}
        render={({ field, fieldState }) => (
          <div className="space-y-2">

            {/* LABEL */}
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-300
                tracking-wide
              "
            >
              {label}
            </label>

            {/* SELECT WRAPPER */}
            <div className="relative">

              <select
                {...field}
                disabled={disabled}
                className={`
                  w-full
                  h-14
                  px-5
                  pr-12
                  rounded-2xl
                  appearance-none
                  border
                  bg-white/[0.04]
                  backdrop-blur-xl
                  text-white
                  outline-none
                  transition-all
                  duration-300
                  ${
                    fieldState.error
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-indigo-500"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  focus:bg-white/[0.06]
                  focus:shadow-[0_0_25px_rgba(99,102,241,0.25)]
                `}
              >

                <option
                  value=""
                  className="bg-[#0F172A] text-slate-400"
                >
                  Select role
                </option>

                {roles.map((role) => (
                  <option
                    key={role._id}
                    value={role._id}
                    className="bg-[#0F172A] text-white"
                  >
                    {role.role_name}
                  </option>
                ))}

              </select>

              {/* ICON */}
              <div
                className="
                  absolute
                  top-1/2
                  right-4
                  -translate-y-1/2
                  pointer-events-none
                  text-slate-400
                "
              >
                <ChevronDown size={18} />
              </div>

            </div>

            {/* ERROR */}
            {fieldState.error && (
              <p className="text-red-400 text-sm ml-1 font-medium">
                {fieldState.error.message}
              </p>
            )}

          </div>
        )}
      />
    </div>
  );
}