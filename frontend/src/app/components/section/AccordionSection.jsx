"use client";

import { ChevronDown } from "lucide-react";

export default function AccordionSection({
  title,
  color,
  open,
  onToggle,
  children,
}) {
  const colors = {
    blue: {
      border: "border-blue-200",
      header: "bg-blue-50",
      hover: "hover:bg-blue-100",
      text: "text-blue-950",
      icon: "text-blue-700",
      iconBg: "bg-blue-100",
      divider: "border-blue-100",
      accent: "bg-blue-700",
      label: "text-blue-700",
    },

    emerald: {
      border: "border-emerald-200",
      header: "bg-emerald-50",
      hover: "hover:bg-emerald-100",
      text: "text-emerald-950",
      icon: "text-emerald-700",
      iconBg: "bg-emerald-100",
      divider: "border-emerald-100",
      accent: "bg-emerald-700",
      label: "text-emerald-700",
    },

    indigo: {
      border: "border-indigo-200",
      header: "bg-indigo-50",
      hover: "hover:bg-indigo-100",
      text: "text-indigo-950",
      icon: "text-indigo-700",
      iconBg: "bg-indigo-100",
      divider: "border-indigo-100",
      accent: "bg-indigo-700",
      label: "text-indigo-700",
    },

    amber: {
      border: "border-amber-200",
      header: "bg-amber-50",
      hover: "hover:bg-amber-100",
      text: "text-amber-950",
      icon: "text-amber-700",
      iconBg: "bg-amber-100",
      divider: "border-amber-100",
      accent: "bg-amber-600",
      label: "text-amber-700",
    },

    violet: {
      border: "border-violet-200",
      header: "bg-violet-50",
      hover: "hover:bg-violet-100",
      text: "text-violet-950",
      icon: "text-violet-700",
      iconBg: "bg-violet-100",
      divider: "border-violet-100",
      accent: "bg-violet-700",
      label: "text-violet-700",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <section
      className={`relative overflow-hidden rounded-xl border ${c.border} bg-white shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${c.accent}`} />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6 ${c.header} ${c.hover}`}
      >
        <div className="min-w-0">
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.18em] ${c.label}`}
          >
            Section Details
          </p>

          <h3 className={`mt-1 truncate text-sm font-bold sm:text-base ${c.text}`}>
            {title}
          </h3>
        </div>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${c.iconBg} ${c.icon} transition-transform duration-200`}
        >
          <ChevronDown
            size={19}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`border-t ${c.divider} bg-white p-4 sm:p-6`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}