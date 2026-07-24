
import jwt from "jsonwebtoken"; // ✅ Make sure this is imported
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import AppError from "../utils/AppError.js";

import sendToken from "../utils/jwtToken.js";
import mongoose from "mongoose"; // ES6 import
import { formatUser } from "../utils/formatUser.js";
import Department from "../models/departmentModel.js";

import Role from "../models/roleModel.js";


// ================= REGISTER USER =================
export const registerUser = async (req, res, next) => {
  try {

    // ============================================
    // HELPER
    // ============================================
    const getString = (field) => {
      if (!field) return "";

      if (Array.isArray(field)) {
        return String(field[0] || "");
      }

      return String(field);
    };

    // ============================================
    // BODY DATA
    // ============================================
    const empCode = getString(req.body.empCode).trim();

    const username = getString(req.body.username).trim();

    const firstName = getString(req.body.firstName).trim();

    const lastName = getString(req.body.lastName).trim();

    const email = getString(req.body.email)
      .trim()
      .toLowerCase();

    const password = getString(req.body.password);

    const confirmPassword = getString(
      req.body.confirmPassword
    );

    const phoneNumber = getString(
      req.body.phoneNumber
    ).trim();

    const roleId = getString(req.body.role).trim();

    const departmentId = getString(
      req.body.department
    ).trim();

    // ============================================
    // REQUIRED VALIDATION
    // ============================================
    if (
      !empCode ||
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !roleId ||
      !departmentId
    ) {
      throw new AppError(
        "All required fields are missing",
        400
      );
    }

    // ============================================
    // PASSWORD MATCH
    // ============================================
    if (password !== confirmPassword) {
      throw new AppError(
        "Passwords do not match",
        400
      );
    }

    // ============================================
    // EMP CODE EXISTS
    // ============================================
    const existingEmpCode = await User.findOne({
      empCode,
    });

    if (existingEmpCode) {
      throw new AppError(
        "Employee code already exists",
        400
      );
    }

    // ============================================
    // EMAIL EXISTS
    // ============================================
    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      throw new AppError(
        "User already exists",
        400
      );
    }

    // ============================================
    // PHONE VALIDATION
    // ============================================
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      throw new AppError(
        "Invalid mobile number",
        400
      );
    }

    // ============================================
    // PHONE EXISTS
    // ============================================
    const existingPhone = await User.findOne({
      phoneNumber,
    });

    if (existingPhone) {
      throw new AppError(
        "Mobile already exists",
        400
      );
    }

    // ============================================
    // VALIDATE ROLE
    // ============================================
    const role = await Role.findById(roleId);

    if (!role) {
      throw new AppError(
        "Invalid role selected",
        400
      );
    }

    // ============================================
    // VALIDATE DEPARTMENT
    // ============================================
    const department = await Department.findById(
      departmentId
    );

    if (!department) {
      throw new AppError(
        "Invalid department selected",
        400
      );
    }

    // ============================================
    // ADMIN VALIDATION
    // ============================================
    if (
      role.role_key === "admin" &&
      email !== process.env.ADMIN_EMAIL
    ) {
      throw new AppError(
        "Not allowed to register as Admin",
        403
      );
    }

    // ============================================
    // PROFILE IMAGE
    // ============================================
    const profilePicPath = req.file
      ? `/uploads/${req.file.filename}`
      : "https://via.placeholder.com/150";

    // ============================================
    // CREATE USER
    // ============================================
    const user = await User.create({
      empCode,
      username,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,

      profilePic: profilePicPath,

      role: role._id,

      // 🔥 DEPARTMENT REF SAVE
      department: department._id,
    });

    // ============================================
    // RESPONSE
    // ============================================
    return res.status(201).json({
      success: true,

      message: "User created successfully",

      userId: user._id,

      user,
    });

  } catch (err) {
    next(err);
  }
};

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {

    // ============================================
    // PAGINATION
    // ============================================
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // ============================================
    // FIND ADMIN ROLE
    // ============================================
    const adminRole = await Role.findOne({
      role_key: "admin",
    });

    // ============================================
    // QUERY
    // ============================================
    let query = {};

    // ============================================
    // EXCLUDE ADMINS
    // ============================================
    if (adminRole) {
      query.role = {
        $ne: adminRole._id,
      };
    }

    // ============================================
    // FETCH USERS
    // ============================================
    const users = await User.find(query)

      // ROLE POPULATE
      .populate(
        "role",
        "role_name role_key"
      )

      // 🔥 DEPARTMENT POPULATE
      .populate(
        "department",
        "department_name"
      )

      .skip(skip)

      .limit(limit)

      .sort({ createdAt: -1 });

    // ============================================
    // TOTAL USERS
    // ============================================
    const totalUsers =
      await User.countDocuments(query);

    // ============================================
    // RESPONSE
    // ============================================
    res.status(200).json({
      success: true,

      users,

      totalUsers,

      currentPage: page,

      totalPages: Math.ceil(
        totalUsers / limit
      ),
    });

  } catch (err) {

    console.error(
      "Get Users Error:",
      err
    );

    res.status(500).json({
      success: false,

      message:
        err.message || "Server Error",
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId, departmentId } = req.body;

    // =========================
    // 1️⃣ Check user exists
    // =========================
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // 2️⃣ Block admin role change
    // =========================
    const currentRole = await Role.findById(user.role);

    if (currentRole?.role_key === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin role cannot be changed",
      });
    }

    // =========================
    // 3️⃣ Validate role (if provided)
    // =========================
    if (roleId) {
      const role = await Role.findById(roleId);

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected",
        });
      }
    }

    // =========================
    // 4️⃣ Validate department (if provided)
    // =========================
    if (departmentId) {
      const department = await Department.findById(departmentId);

      if (!department) {
        return res.status(400).json({
          success: false,
          message: "Invalid department selected",
        });
      }
    }

    // =========================
    // 5️⃣ BUILD UPDATE OBJECT
    // =========================
    const updateData = {};

    if (roleId) updateData.role = roleId;
    if (departmentId) updateData.department = departmentId;

    // =========================
    // 6️⃣ UPDATE USER
    // =========================
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: false, // avoid required validation crash
      }
    )
      .populate("role")
      .populate("department");

    return res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find user + populate role
    const user = await User.findById(id).populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 Prevent deleting admin
    if (user.role?.role_key === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin cannot be deleted",
      });
    }

    // ✅ Delete
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const orFilters = [];

    // 1️⃣ ObjectId filter
    if (mongoose.Types.ObjectId.isValid(query)) {
      orFilters.push({ _id: query });
    }

    // 2️⃣ Date filter (dd/mm/yyyy)
    const dateMatch = query.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1; // JS month 0-indexed
      const year = parseInt(dateMatch[3], 10);

      // UTC timezone के हिसाब से date filter
      const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

      orFilters.push({ createdAt: { $gte: start, $lte: end } });
    }

    // 3️⃣ Regex search (Name और Email)
    const escapedQuery = escapeRegex(query);
    const regex = new RegExp(escapedQuery, "i"); // case-insensitive
    orFilters.push({ Name: { $regex: regex } });
    orFilters.push({ Email: { $regex: regex } });

    // MongoDB query: OR condition सभी filters पर
    const users = await User.find({ $or: orFilters })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ users, totalUsers: users.length });
  } catch (err) {
    console.error("Search Users Error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};