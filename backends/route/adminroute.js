import express from "express";

import {
  getAllUsers,
  deleteUser,
  getSingleUser,
  searchUsers,
  registerUser,
  getDashboardStats,
  updateUser,
} from "../controller/admincontroller.js";

import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middleware/auth.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// ==========================
// ADMIN ROUTES
// ==========================
router.get("/dashboard/stats", getDashboardStats);

// 🔹 Get all users (ADMIN only)
router.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

// 🔹 Search users (ADMIN only)
router.get(
  "/users/search",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  searchUsers
);

// 🔹 Get single user (ADMIN only)
router.get(
  "/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSingleUser
);

// 🔹 Delete user (ADMIN only)
router.delete(
  "/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser
);

// 🔹 Update user (ADMIN only)
router.put(
  "/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUser
);

// ==========================
// ROLE BASED ROUTE (IMPORTANT FIX)
// ==========================



// ==========================
// REGISTER USER (PUBLIC OR ADMIN)
// ==========================

router.post(
  "/registers",
  upload.single("profileImage"),
  registerUser
);

export default router;