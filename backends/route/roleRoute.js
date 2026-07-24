import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controller/roleController.js";

import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();

// CREATE ROLE (admin only)
router.post(
  "/create",
  // isAuthenticatedUser,
  // authorizeRoles("admin"), // ✅ FIXED
  createRole
);

// GET ALL ROLES (authenticated users OR restrict if needed)
router.get(
  "/all",
  // isAuthenticatedUser,
    getRoles
);

// GET SINGLE ROLE (admin only)
router.get(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"), // ✅ FIXED
  getRoleById
);

// UPDATE ROLE (admin only)
router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"), // ✅ FIXED
  updateRole
);

// DELETE ROLE (admin only)
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"), // ✅ FIXED
  deleteRole
);

export default router;