import { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function ActionDropdown({ onUpdate, onView, onDelete }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = (cb) => {
    cb?.();
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-800"
      >
        <MoreVertIcon fontSize="small" />
      </button>

      <div
        className={`absolute right-0 z-50 mt-2 w-52 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl transition-all duration-150 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="bg-[#0b3a6f] px-4 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-white">
            Actions
          </p>
        </div>

        {onView && (
          <button
            onClick={() => close(onView)}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-blue-50"
          >
            <VisibilityOutlinedIcon fontSize="small" className="text-blue-700" />
            View Details
          </button>
        )}

        {onUpdate && (
          <button
            onClick={() => close(onUpdate)}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-blue-50"
          >
            <EditIcon fontSize="small" className="text-amber-600" />
            Update Record
          </button>
        )}

        {onDelete && (
          <>
            <div className="border-t border-slate-200" />
            <button
              onClick={() => close(onDelete)}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <DeleteOutlinedIcon fontSize="small" />
              Delete Record
            </button>
          </>
        )}
      </div>
    </div>
  );
}