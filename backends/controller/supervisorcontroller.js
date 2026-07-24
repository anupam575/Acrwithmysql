
import mongoose from "mongoose";
import Supervisor from "../models/Supervisor.js";
import MasterEmployee from "../models/MasterEmployee.js";

export const getSupervisorFields = (body) => ({
  tasks: body.tasks,
  achievements: body.achievements,
  name: body.name,
  designation: body.designation,

  shortfalls: body.shortfalls,
  higherAchievements: body.higherAchievements,

  place: body.place,
  date: body.date,


  financialYear: body.financialYear,
  status: body.status || "draft",
  department: body.department || null,

  reportingOfficerId: body.reportingOfficerId,
});
   
const buildFileObject = (file) => {
  if (!file) return null;

  return {
    url: `/uploads/${file.filename}`,
    public_id: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

export const createSupervisor = async (req, res) => {
  try {
    console.log("🔥 REQUEST BODY:", req.body);
    console.log("📁 REQUEST FILES:", req.files);

    const employeeId = req.employeeRefId;
    console.log("👤 employeeId from token:", employeeId);

    // ================= GET EMPLOYEE =================
    const employee = await MasterEmployee.findOne({
      employeeRefId: employeeId,
    })
      .select("category employeeRefId department")
      .lean();

    console.log("👨‍💼 EMPLOYEE FROM DB:", employee);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ================= DUPLICATE CHECK =================
    const alreadyExists = await Supervisor.findOne({
      employeeId: employee.employeeRefId,
      reportingOfficerId: req.body.reportingOfficerId,
      financialYear: req.body.financialYear,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Supervisor appraisal already exists for this reporting officer and financial year",
      });
    }

    // ================= PARSE BODY (FormData SAFE) =================
    const parseIfJson = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    const parsedBody = {};
    for (const key in req.body) {
      parsedBody[key] = parseIfJson(req.body[key]);
    }

    // ================= BUILD PAYLOAD =================
    const payload = getSupervisorFields(parsedBody);

    // ================= ADD SYSTEM FIELDS =================
    payload.employeeId = employee.employeeRefId;
    payload.category = employee.category;

    if (!payload.financialYear) {
      payload.financialYear = parsedBody.financialYear || "";
    }

    // ================= ATTACH FILE =================
    payload.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    console.log("🚀 FINAL PAYLOAD BEFORE SAVE:", payload);

    // ================= SAVE =================
    const supervisor = await Supervisor.create(payload);

    console.log("✅ SAVED SUPERVISOR:", supervisor);

    return res.status(201).json({
      success: true,
      message: "Supervisor appraisal created successfully",
      data: supervisor,
    });

  } catch (error) {
    console.error("❌ ERROR OCCURRED:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const viewEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const reportingOfficerId = req.user._id; // 👈 current logged-in user

    console.log("🔍 Employee ID:", employeeId);
    console.log("👤 Reporting Officer:", reportingOfficerId);

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    /* =========================================
       FIND SELF APPRAISAL WITH REPORTING FILTER
    ========================================= */

    const employeeDetails = await Supervisor.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      reportingOfficerId: new mongoose.Types.ObjectId(reportingOfficerId), // 👈 IMPORTANT FILTER
    })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();
    /* =========================================
       NOT FOUND / UNAUTHORIZED CASE
    ========================================= */

    if (!employeeDetails) {
      return res.status(404).json({
        success: false,
        message:
          "No appraisal found OR you are not the reporting officer for this employee",
      });
    }

    /* =========================================
       SUCCESS
    ========================================= */

    return res.status(200).json({
      success: true,
      data: employeeDetails,
    });

  } catch (error) {
    console.log("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
export const viewEmployeeDetail = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const appraisals = await Supervisor.find({
      employeeId,
    })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    if (!appraisals.length) {
      return res.status(404).json({
        success: false,
        message: "No appraisal records found",
      });
    }

    const formattedData = appraisals.map((item) => ({
      ...item,

      // Sirf name bhejo
      department: item.department?.department_name || "",

      // Sirf firstName bhejo
      reportingOfficer: item.reportingOfficerId?.firstName || "",
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
export const updateSupervisor = async (req, res) => {
  try {
    /* ================= GET EMPLOYEE ================= */

    const employeeId = req.employeeRefId;

    const employee = await MasterEmployee.findOne({
      employeeRefId: employeeId,
    })
      .select("category employeeRefId")
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    /* ================= PAYLOAD ================= */

    const payload = getSupervisorFields(req.body);

    // Never allow updating these fields
    delete payload.department;
    delete payload.reportingOfficerId;
    delete payload.employeeId;
    delete payload.category;

    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor appraisal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supervisor appraisal updated successfully",
      data: supervisor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id)
      .populate("employeeId")
      .populate("reportingOfficerId");

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor appraisal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: supervisor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllSupervisors = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ============================================
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // ============================================

    const filter = { employeeId };

    const totalSupervisors = await Supervisor.countDocuments(filter);

    const supervisors = await Supervisor.find(filter)
      .populate({
        path: "category",
        select: "_id name category_key",
      })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: supervisors.length,
      totalSupervisors,
      currentPage: page,
      totalPages: Math.ceil(totalSupervisors / limit),
      limit,
      data: supervisors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor appraisal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supervisor appraisal deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};










export const viewapprisalDetails = async (req, res) => {
  try {
    const { appraisalId } = req.params;

    console.log("🔍 Supervisor Appraisal ID:", appraisalId);

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(appraisalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Appraisal ID",
      });
    }

    const supervisorDetails = await Supervisor.findById(appraisalId)
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "employeeId",
        select: "firstName lastName employeeId email",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName lastName",
      })
      .populate({
        path: "category",
      })
      .lean();

    /* ================= NOT FOUND ================= */
    if (!supervisorDetails) {
      return res.status(404).json({
        success: false,
        message: "No Supervisor Appraisal found",
      });
    }

    /* ================= SUCCESS ================= */
    return res.status(200).json({
      success: true,
      data: supervisorDetails,
    });

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};