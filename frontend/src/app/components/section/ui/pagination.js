"use client";

import React from "react";

function UIPagination({ totalPages = 1, page = 1, onChange }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onChange(newPage);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4">

            {/* Prev */}
            <button
                disabled={page === 1}
                onClick={() => handleChange(page - 1)}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
            >
                Prev
            </button>

            {/* Pages */}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => handleChange(p)}
                    aria-current={page === p ? "page" : undefined}
                    className={`px-3 py-1 rounded ${
                        page === p
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                >
                    {p}
                </button>
            ))}

            {/* Next */}
            <button
                disabled={page === totalPages}
                onClick={() => handleChange(page + 1)}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
            >
                Next
            </button>

        </div>
    );
}

export default UIPagination;