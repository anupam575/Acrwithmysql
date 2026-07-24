// categoryController.js
import Category from "../models/categoryModel.js";
import mongoose from "mongoose"; // ES6 import
const generateKey = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "");
export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    // 1. validate
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();


    // 3. duplicate name check
    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // 4. generate key
    const category_key = generateKey(name);

    // 5. create
    const category = await Category.create({
      name,
      category_key,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    // 1. validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    // 2. find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3. validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();


    // 4. duplicate check (ignore self)
    const exists = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // 5. ONLY update name (NOT key)
    category.name = name;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // 2️⃣ Find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3️⃣ Success response
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("[GET CATEGORY BY ID ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    // 2. Find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3. Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE CATEGORY ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};