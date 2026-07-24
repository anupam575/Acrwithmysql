import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categorycontroller.js";

const router = express.Router();

// Create category
router.post("/create", createCategory);

// Get all categories
router.get("/", getAllCategories);

// Get single category
router.get("/:id", getCategoryById);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;