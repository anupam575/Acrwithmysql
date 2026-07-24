import express from "express";
import {
  createDepartment,
  getDepartments,

   getDepartmentById,
  updateDepartment,
  getDepartmentCount,
  deleteDepartment,
} from "../controller/departmentcontroller.js";

const router = express.Router();

// ✅ Create Department (Admin)
router.post("/create", createDepartment);

// ✅ Get All Departments (Dropdown)
router.get("/all", getDepartments);

router.get("/:id", getDepartmentById);

// UPDATE
router.put("/:id", updateDepartment);
router.get("/department/count", getDepartmentCount);
// DELETE
router.delete("/:id", deleteDepartment);

export default router;