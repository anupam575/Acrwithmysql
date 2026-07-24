"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../utils/axiosInstance";

const ViewUserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUser(data.user);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUser();
  }, [id]);

  if (!user)
    return (
      <div className="p-6 text-gray-500 text-center text-lg">
        Loading user...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-200 pb-6">
        {user.ProfilePic && (
          <img
            src={user.ProfilePic}
            alt={`${user.first_name} Profile`}
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
          />
        )}

        <div>
          {/* ✅ FIXED NAME */}
          <h1 className="text-3xl font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h1>

          <p className="text-gray-500 mt-1">
            Role:{" "}
            <span className="font-medium text-indigo-600">
              {user.Role}
            </span>
          </p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-gray-700">
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Email</p>
          <p className="text-gray-800">{user.Email}</p>
        </div>

        {/* ✅ FIXED PHONE */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Mobile</p>
          <p className="text-gray-800">{user.phone_number}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Address</p>
          <p className="text-gray-800">{user.Address1}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">District</p>
          <p className="text-gray-800">{user.District}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Designation</p>
          <p className="text-gray-800">{user.Designation}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Gender</p>
          <p className="text-gray-800">{user.Gender}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">DOB</p>
          <p className="text-gray-800">
            {new Date(user.DOB).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Username</p>
          <p className="text-gray-800">{user.Username}</p>
        </div>

        {/* ✅ NEW FIELDS */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Job Title</p>
          <p className="text-gray-800">{user.job_title || "N/A"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Salary</p>
          <p className="text-gray-800">{user.salary || "N/A"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Department</p>
          <p className="text-gray-800">
            {user.department_name || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;