import Designation from "../models/designationModel.js";
import mongoose from "mongoose";

// ✅ regex (only letters + single space)
const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

// ✅ escape regex (security)
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ================= CREATE DESIGNATION =================
export const createDesignation = async (req, res) => {
  try {
    let { name } = req.body;

    // 1️⃣ required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation name is required",
      });
    }

    name = name.trim();

    // 2️⃣ validation
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and single spaces allowed",
      });
    }

    // 3️⃣ duplicate check (case-insensitive)
    const safeName = escapeRegex(name);

    const existing = await Designation.findOne({
      name: { $regex: `^${safeName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Designation already exists",
      });
    }

    // 4️⃣ create
    const designation = await Designation.create({ name });

    res.status(201).json({
      success: true,
      message: "Designation created successfully",
      designation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//

// ================= GET SINGLE =================
export const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid designation ID",
      });
    }

    const designation = await Designation.findById(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      designation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================
export const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    // 1️⃣ validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid designation ID",
      });
    }

    const designation = await Designation.findById(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    // 2️⃣ required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation name is required",
      });
    }

    name = name.trim();

    // 3️⃣ validation
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and single spaces allowed",
      });
    }

    // 4️⃣ same name check
    if (name === designation.name) {
      return res.status(400).json({
        success: false,
        message: "New name must be different",
      });
    }

    // 5️⃣ duplicate check
    const safeName = escapeRegex(name);

    const existing = await Designation.findOne({
      _id: { $ne: id },
      name: { $regex: `^${safeName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Designation already exists",
      });
    }

    // 6️⃣ update
    designation.name = name;
    await designation.save();

    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      designation,
    });

  } catch (error) {
    console.error("[UPDATE DESIGNATION ERROR]:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};





export const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: designations.length,
      designations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= DELETE =================
export const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid designation ID",
      });
    }

    const designation = await Designation.findById(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    await Designation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });

  } catch (error) {
    console.error("[DELETE DESIGNATION ERROR]:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};