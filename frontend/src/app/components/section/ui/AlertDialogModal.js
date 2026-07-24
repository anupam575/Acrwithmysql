"use client";

import React from "react";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export const AlertDialogModal = ({
  open,
  onClose,
  onConfirm,
  message, // dynamic message
  confirmText = "Delete", // default Delete
  iconColor = "red", // optional color
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <WarningRoundedIcon className={`text-${iconColor}-600`} />
          <h3 className="text-lg font-semibold text-gray-800">Confirmation</h3>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-4" />

        {/* Content */}
        <p className="text-gray-700 mb-6">
          {message || "Are you sure you want to delete this order?"}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-semibold ${
              confirmText === "Delete"
                ? "bg-red-500 text-white hover:bg-red-700"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialogModal;
