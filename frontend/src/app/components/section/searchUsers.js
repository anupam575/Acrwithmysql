"use client";
import React, { useState } from "react";

const UserSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search by Name, Email, ID, or Created Date (dd/mm/yyyy)"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          onSearch(value); // send value immediately to parent
        }}
        className="
          w-full px-4 py-2
          rounded-lg border border-gray-300
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-sm placeholder-gray-400 transition
        "
      />
    </div>
  );
};

export default UserSearch;