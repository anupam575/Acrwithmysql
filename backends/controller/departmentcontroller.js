import Department from "../models/departmentModel.js";

// =========================
// CREATE DEPARTMENT
// =========================
export const createDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;

    if (!department_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const name = department_name.trim();

    const existing = await Department.findOne({
      department_name: name,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      department_name: name,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (err) {
    console.error("❌ Create Department Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};




export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (err) {
    console.error("❌ Get Departments Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};



export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (err) {
    console.error("❌ Get Department Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};



export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name } = req.body;

    if (!department_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const name = department_name.trim();

    const existing = await Department.findOne({
      department_name: name,
      _id: { $ne: id }, // ignore current record
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      { department_name: name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: updated,
    });
  } catch (err) {
    console.error("❌ Update Department Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};




export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Department.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete Department Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};


export const getDepartmentCount = async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();

    res.status(200).json({
      success: true,
      totalDepartments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};