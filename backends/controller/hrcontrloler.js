import mongoose from "mongoose";
import User from "../models/userModel.js";
import EmployeeNew from "../models/employee.js"; // path apne project ke hisaab se adjust karo

import EmployeeDetail from "../models/EmployeeDetail.js";

import { employeeDTO } from "../dto/employee.dto.js";
import { employeeNewDTO } from "../dto/employee.dto.js";

import bcrypt from "bcryptjs";
import { employeeService } from "../services/employeeservice.js";
import { updateemployeeService } from "../services/employeeservice.js";
import { createMasterEmployee } from "../services/masterEmployee.service.js";

import { updateMasterEmployee } from "../services/masterEmployee.service.js";

import { updatebasicemployeeService } from "../services/employeeservice.js";
import { basicemployeeService } from "../services/employeeservice.js";

import MasterEmployee from "../models/MasterEmployee.js";
import empToken from "../utils/sendEmployeeToken.js";

import SelfAppraisal from "../models/apprisalModel.js";
import Supervisor from "../models/Supervisor.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../utils/AppError.js";


export const getAllMasterEmployees = async (req, res) => {
  try {
    // ============================================
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // ============================================

    const totalEmployees = await MasterEmployee.countDocuments();

    const employees = await MasterEmployee.find()
      .populate("category")
      .populate("designation")
      .populate("role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: employees.length,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      limit,
      data: employees,
    });
  } catch (error) {
    console.error("MASTER_EMPLOYEE_ALL_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ============================
// GET ALL FINANCIAL YEARS (dropdown ke liye)
// ============================
export const getAllFinancialYears = async (req, res) => {
  try {
    const selfYears = await SelfAppraisal.distinct("currentFinancialYear");
    const supervisorYears = await Supervisor.distinct("financialYear");

    const allYears = [
      ...new Set([...selfYears, ...supervisorYears].filter(Boolean)),
    ].sort((a, b) => b.localeCompare(a));

    return res.status(200).json({
      success: true,
      data: allYears,
    });
  } catch (error) {
    console.error("FINANCIAL_YEARS_FETCH_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============================
// GET ALL MASTER EMPLOYEES (with optional financialYear filter)
// ============================
export const getAllMasterEmployee = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const financialYear = req.query.financialYear?.trim();

    let employeeQuery = {};

    // ============================
    // STEP 1: Agar financialYear filter aaya hai — sirf uske matching
    // employeeIds DB-level pe nikalo (poori collection load nahi karni)
    // ============================
    if (financialYear) {
      const [selfMatchedIds, supervisorMatchedIds] = await Promise.all([
        SelfAppraisal.distinct("employeeId", {
          currentFinancialYear: financialYear,
        }),
        Supervisor.distinct("employeeId", {
          financialYear: financialYear,
        }),
      ]);

      // Dono se aaye employeeIds ko union karo (duplicate hatao)
      const matchedEmployeeIds = [
        ...new Set(
          [...selfMatchedIds, ...supervisorMatchedIds].map((id) =>
            id.toString()
          )
        ),
      ];

      employeeQuery.employeeRefId = { $in: matchedEmployeeIds };
    }

    // ============================
    // STEP 2: Count + paginated employees fetch karo
    // ============================
    const totalEmployees = await MasterEmployee.countDocuments(employeeQuery);

    const employees = await MasterEmployee.find(employeeQuery)
      .populate("category")
      .populate("designations")
      .populate("role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ============================
    // STEP 3: Sirf CURRENT PAGE ke employees ke liye unka financial year
    // nikalo (poori collection load nahi, sirf in employeeRefIds ke liye)
    // ============================
    const currentPageEmployeeIds = employees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfAppraisals, supervisorAppraisals] = await Promise.all([
      SelfAppraisal.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId currentFinancialYear")
        .lean(),
      Supervisor.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId financialYear")
        .lean(),
    ]);

    // employeeId -> Set of financial years (overwrite nahi, dono collections
    // ka data preserve hota hai)
    const appraisalMap = {};

    selfAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.currentFinancialYear) {
        appraisalMap[id].add(item.currentFinancialYear);
      }
    });

    supervisorAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.financialYear) {
        appraisalMap[id].add(item.financialYear);
      }
    });

    // ============================
    // STEP 4: Har employee ke saath uske financial years attach karo
    // ============================
    const finalData = employees.map((emp) => {
      const id = emp.employeeRefId?.toString();
      const years = id && appraisalMap[id] ? [...appraisalMap[id]] : [];

      return {
        ...emp,
        // agar filter lagaya tha to wahi selected year dikhao,
        // warna sabhi years jo employee ke paas hain
        currentFinancialYear: financialYear
          ? financialYear
          : years[0] || null,
        financialYears: years, // employee ke saare financial years (Self + Supervisor dono)
      };
    });

    return res.status(200).json({
      success: true,
      count: finalData.length,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      limit,
      data: finalData,
    });
  } catch (error) {
    console.error("MASTER_EMPLOYEE_ALL_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============================================
// GET FINANCIAL YEARS (reporting-role-matched employees ke liye)
// ============================================
export const getFinancialYearsByUserRoleMatch = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const matchedEmployees = await MasterEmployee.find({
      "authorities.reporting": { $elemMatch: { name: currentUserId } }, // 👈 reporting
    })
      .select("employeeRefId")
      .lean();

    const employeeRefIds = matchedEmployees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfYears, supervisorYears] = await Promise.all([
      SelfAppraisal.distinct("currentFinancialYear", {
        employeeId: { $in: employeeRefIds },
      }),
      Supervisor.distinct("financialYear", {
        employeeId: { $in: employeeRefIds },
      }),
    ]);

    const allYears = [
      ...new Set([...selfYears, ...supervisorYears].filter(Boolean)),
    ].sort((a, b) => b.localeCompare(a));

    return res.status(200).json({ success: true, data: allYears });
  } catch (error) {
    console.error("FINANCIAL_YEARS_FETCH_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============================================
// GET EMPLOYEES BY REPORTING-ROLE MATCHING + OPTIONAL FINANCIAL YEAR FILTER
// ============================================
export const getEmployeesByUserRoleMatch = async (req, res) => {
  try {
    // ============================================
    // STEP 1: Current Logged-in User + Pagination
    // ============================================
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const financialYear = req.query.financialYear?.trim();

    // ============================================
    // STEP 2: Match Condition — sirf wahi employee
    // jinke reporting authority me current user hai
    // ============================================
    const matchCondition = {
      "authorities.reporting": {
        $elemMatch: { name: currentUserId },
      },
    };

    // ============================================
    // STEP 3: Agar financialYear filter aaya hai —
    // sirf uske matching employeeIds DB-level pe nikalo
    // (poori collection load nahi karni)
    // ============================================
    if (financialYear) {
      const [selfMatchedIds, supervisorMatchedIds] = await Promise.all([
        SelfAppraisal.distinct("employeeId", {
          currentFinancialYear: financialYear,
        }),
        Supervisor.distinct("employeeId", {
          financialYear: financialYear,
        }),
      ]);

      // ✅ FIX: string ki jagah ObjectId array banao, warna aggregate($match)
      // me casting nahi hoti aur result empty aata hai
      const matchedEmployeeIds = [
        ...new Set(
          [...selfMatchedIds, ...supervisorMatchedIds].map((id) =>
            id.toString()
          )
        ),
      ].map((id) => new mongoose.Types.ObjectId(id));

      matchCondition.employeeRefId = { $in: matchedEmployeeIds };
    }

    // ============================================
    // STEP 4: Total Matching Employees
    // ============================================
    const totalEmployees = await MasterEmployee.countDocuments(
      matchCondition
    );

    // ============================================
    // STEP 5: Fetch Employees (aggregate + lookups)
    // ============================================
    const employees = await MasterEmployee.aggregate([
      { $match: matchCondition },

      // DESIGNATION
      {
        $lookup: {
          from: "designations",
          localField: "designations",
          foreignField: "_id",
          as: "designationData",
        },
      },

      // CATEGORY
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },

      // ROLE
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },

      // FINAL SHAPE
      {
        $project: {
          employeeRefId: 1,
          employeeCode: 1,
          email: 1,
          createdAt: 1,
          isActive: 1,
          authorities: 1,
          designation: { $arrayElemAt: ["$designationData", 0] },
          category: { $arrayElemAt: ["$categoryData", 0] },
          role: { $arrayElemAt: ["$roleData", 0] },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // ============================================
    // STEP 6: Sirf CURRENT PAGE ke employees ke liye
    // unka financial year data nikalo (poori collection nahi)
    // ============================================
    const currentPageEmployeeIds = employees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfAppraisals, supervisorAppraisals] = await Promise.all([
      SelfAppraisal.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId currentFinancialYear")
        .lean(),
      Supervisor.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId financialYear")
        .lean(),
    ]);

    // employeeId -> Set of financial years (dono collections ka data
    // preserve hota hai, overwrite bug fix)
    const appraisalMap = {};

    selfAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.currentFinancialYear) {
        appraisalMap[id].add(item.currentFinancialYear);
      }
    });

    supervisorAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.financialYear) {
        appraisalMap[id].add(item.financialYear);
      }
    });

    // ============================================
    // STEP 7: Attach Financial Year(s) to Each Employee
    // ============================================
    const finalData = employees.map((emp) => {
      const id = emp.employeeRefId?.toString();
      const years = id && appraisalMap[id] ? [...appraisalMap[id]] : [];

      return {
        ...emp,
        currentFinancialYear: financialYear
          ? financialYear
          : years[0] || null,
        financialYears: years,
      };
    });

    // ============================================
    // STEP 8: Response
    // ============================================
    return res.status(200).json({
      success: true,
      count: finalData.length,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      limit,
      data: finalData,
    });
  } catch (error) {
    console.error("GET_EMPLOYEE_BY_REPORTING_ROLE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getFinancialYearsByUserRoleMatches = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const matchedEmployees = await MasterEmployee.find({
      "authorities.reviewing": { $elemMatch: { name: currentUserId } }, // 👈 reviewing
    })
      .select("employeeRefId")
      .lean();

    const employeeRefIds = matchedEmployees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfYears, supervisorYears] = await Promise.all([
      SelfAppraisal.distinct("currentFinancialYear", {
        employeeId: { $in: employeeRefIds },
      }),
      Supervisor.distinct("financialYear", {
        employeeId: { $in: employeeRefIds },
      }),
    ]);

    const allYears = [
      ...new Set([...selfYears, ...supervisorYears].filter(Boolean)),
    ].sort((a, b) => b.localeCompare(a));

    return res.status(200).json({ success: true, data: allYears });
  } catch (error) {
    console.error("FINANCIAL_YEARS_FETCH_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ============================================
// GET EMPLOYEES BY REVIEWING-ROLE MATCHING + OPTIONAL FINANCIAL YEAR FILTER
// ============================================
export const getEmployeesByUserRoleMatches = async (req, res) => {
  try {
    // ============================================
    // STEP 1: Current Logged-in User + Pagination
    // ============================================
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const financialYear = req.query.financialYear?.trim();

    // ============================================
    // STEP 2: Match Condition — sirf wahi employee
    // jinke reviewing authority me current user hai
    // ============================================
    const matchCondition = {
      "authorities.reviewing": {
        $elemMatch: { name: currentUserId },
      },
    };

    // ============================================
    // STEP 3: Agar financialYear filter aaya hai —
    // sirf uske matching employeeIds DB-level pe nikalo
    // (poori collection load nahi karni)
    // ============================================
    if (financialYear) {
      const [selfMatchedIds, supervisorMatchedIds] = await Promise.all([
        SelfAppraisal.distinct("employeeId", {
          currentFinancialYear: financialYear,
        }),
        Supervisor.distinct("employeeId", {
          financialYear: financialYear,
        }),
      ]);

      // ✅ FIX: string ki jagah ObjectId array banao, warna aggregate($match)
      // me casting nahi hoti aur result empty aata hai
      const matchedEmployeeIds = [
        ...new Set(
          [...selfMatchedIds, ...supervisorMatchedIds].map((id) =>
            id.toString()
          )
        ),
      ].map((id) => new mongoose.Types.ObjectId(id));

      matchCondition.employeeRefId = { $in: matchedEmployeeIds };
    }

    // ============================================
    // STEP 4: Total Matching Employees
    // ============================================
    const totalEmployees = await MasterEmployee.countDocuments(
      matchCondition
    );

    // ============================================
    // STEP 5: Fetch Employees (aggregate + lookups)
    // ============================================
    const employees = await MasterEmployee.aggregate([
      { $match: matchCondition },

      // DESIGNATION
      {
        $lookup: {
          from: "designations",
          localField: "designations",
          foreignField: "_id",
          as: "designationData",
        },
      },

      // CATEGORY
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },

      // ROLE
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },

      // FINAL SHAPE
      {
        $project: {
          employeeRefId: 1,
          employeeCode: 1,
          email: 1,
          createdAt: 1,
          isActive: 1,
          authorities: 1,
          designation: { $arrayElemAt: ["$designationData", 0] },
          category: { $arrayElemAt: ["$categoryData", 0] },
          role: { $arrayElemAt: ["$roleData", 0] },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // ============================================
    // STEP 6: Sirf CURRENT PAGE ke employees ke liye
    // unka financial year data nikalo (poori collection nahi)
    // ============================================
    const currentPageEmployeeIds = employees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfAppraisals, supervisorAppraisals] = await Promise.all([
      SelfAppraisal.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId currentFinancialYear")
        .lean(),
      Supervisor.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId financialYear")
        .lean(),
    ]);

    // employeeId -> Set of financial years (dono collections ka data
    // preserve hota hai, overwrite bug fix)
    const appraisalMap = {};

    selfAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.currentFinancialYear) {
        appraisalMap[id].add(item.currentFinancialYear);
      }
    });

    supervisorAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.financialYear) {
        appraisalMap[id].add(item.financialYear);
      }
    });

    // ============================================
    // STEP 7: Attach Financial Year(s) to Each Employee
    // ============================================
    const finalData = employees.map((emp) => {
      const id = emp.employeeRefId?.toString();
      const years = id && appraisalMap[id] ? [...appraisalMap[id]] : [];

      return {
        ...emp,
        currentFinancialYear: financialYear
          ? financialYear
          : years[0] || null,
        financialYears: years,
      };
    });

    // ============================================
    // STEP 8: Response
    // ============================================
    return res.status(200).json({
      success: true,
      count: finalData.length,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      limit,
      data: finalData,
    });
  } catch (error) {
    console.error("GET_EMPLOYEE_BY_USER_ROLE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// ============================================
// GET FINANCIAL YEARS (role-matched employees ke liye)
// ============================================
export const getFinancialYearsByUserRoleMatching = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const matchedEmployees = await MasterEmployee.find({
      "authorities.accepting": { $elemMatch: { name: currentUserId } },
    })
      .select("employeeRefId")
      .lean();

    const employeeRefIds = matchedEmployees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfYears, supervisorYears] = await Promise.all([
      SelfAppraisal.distinct("currentFinancialYear", {
        employeeId: { $in: employeeRefIds },
      }),
      Supervisor.distinct("financialYear", {
        employeeId: { $in: employeeRefIds },
      }),
    ]);

    const allYears = [
      ...new Set([...selfYears, ...supervisorYears].filter(Boolean)),
    ].sort((a, b) => b.localeCompare(a));

    return res.status(200).json({ success: true, data: allYears });
  } catch (error) {
    console.error("FINANCIAL_YEARS_FETCH_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getEmployeesByUserRoleMatching = async (req, res) => {
  try {
    // ============================================
    // STEP 1: Current Logged-in User + Pagination
    // ============================================
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const financialYear = req.query.financialYear?.trim();

    // ============================================
    // STEP 2: Match Condition — sirf wahi employee
    // jinke accepting authority me current user hai
    // ============================================
    const matchCondition = {
      "authorities.accepting": {
        $elemMatch: { name: currentUserId },
      },
    };

    // ============================================
    // STEP 3: Agar financialYear filter aaya hai —
    // sirf uske matching employeeIds DB-level pe nikalo
    // (poori collection load nahi karni)
    // ============================================
    if (financialYear) {
      const [selfMatchedIds, supervisorMatchedIds] = await Promise.all([
        SelfAppraisal.distinct("employeeId", {
          currentFinancialYear: financialYear,
        }),
        Supervisor.distinct("employeeId", {
          financialYear: financialYear,
        }),
      ]);

      // ✅ FIX: string ki jagah ObjectId array banao, warna aggregate($match)
      // me casting nahi hoti aur result empty aata hai
      const matchedEmployeeIds = [
        ...new Set(
          [...selfMatchedIds, ...supervisorMatchedIds].map((id) =>
            id.toString()
          )
        ),
      ].map((id) => new mongoose.Types.ObjectId(id));

      matchCondition.employeeRefId = { $in: matchedEmployeeIds };
    }

    // ============================================
    // STEP 4: Total Matching Employees
    // ============================================
    const totalEmployees = await MasterEmployee.countDocuments(
      matchCondition
    );

    // ============================================
    // STEP 5: Fetch Employees (aggregate + lookups)
    // ============================================
    const employees = await MasterEmployee.aggregate([
      { $match: matchCondition },

      // DESIGNATION
      {
        $lookup: {
          from: "designations",
          localField: "designations",
          foreignField: "_id",
          as: "designationData",
        },
      },

      // CATEGORY
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },

      // ROLE
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },

      // FINAL SHAPE
      {
        $project: {
          employeeRefId: 1,
          employeeCode: 1,
          email: 1,
          createdAt: 1,
          isActive: 1,
          authorities: 1,
          designation: { $arrayElemAt: ["$designationData", 0] },
          category: { $arrayElemAt: ["$categoryData", 0] },
          role: { $arrayElemAt: ["$roleData", 0] },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // ============================================
    // STEP 6: Sirf CURRENT PAGE ke employees ke liye
    // unka financial year data nikalo (poori collection nahi)
    // ============================================
    const currentPageEmployeeIds = employees
      .map((emp) => emp.employeeRefId)
      .filter(Boolean);

    const [selfAppraisals, supervisorAppraisals] = await Promise.all([
      SelfAppraisal.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId currentFinancialYear")
        .lean(),
      Supervisor.find({
        employeeId: { $in: currentPageEmployeeIds },
      })
        .select("employeeId financialYear")
        .lean(),
    ]);

    // employeeId -> Set of financial years (dono collections ka data
    // preserve hota hai, overwrite bug fix)
    const appraisalMap = {};

    selfAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.currentFinancialYear) {
        appraisalMap[id].add(item.currentFinancialYear);
      }
    });

    supervisorAppraisals.forEach((item) => {
      const id = item.employeeId.toString();
      if (!appraisalMap[id]) appraisalMap[id] = new Set();
      if (item.financialYear) {
        appraisalMap[id].add(item.financialYear);
      }
    });

    // ============================================
    // STEP 7: Attach Financial Year(s) to Each Employee
    // ============================================
    const finalData = employees.map((emp) => {
      const id = emp.employeeRefId?.toString();
      const years = id && appraisalMap[id] ? [...appraisalMap[id]] : [];

      return {
        ...emp,
        currentFinancialYear: financialYear
          ? financialYear
          : years[0] || null,
        financialYears: years,
      };
    });

    // ============================================
    // STEP 8: Response
    // ============================================
    return res.status(200).json({
      success: true,
      count: finalData.length,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      limit,
      data: finalData,
    });
  } catch (error) {
    console.error("GET_EMPLOYEE_BY_ACCEPTING_ROLE_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};







// ============================
// ACCEPTING
// ============================

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    // =========================
    // FIND MASTER RECORD
    // =========================
    const masterRecord = await MasterEmployee.findOne({
      employeeRefId: id,
    });

    if (!masterRecord) {
      return res.status(404).json({
        success: false,
        message: "MasterEmployee not found",
      });
    }

    // =========================
    // DELETE FROM SOURCE TABLE
    // =========================
    let deletedEmployee = null;

    if (masterRecord.sourceModel === "EmployeeNew") {
      deletedEmployee = await EmployeeNew.findByIdAndDelete(id);
    } else if (masterRecord.sourceModel === "EmployeeDetail") {
      deletedEmployee = await EmployeeDetail.findByIdAndDelete(id);
    }

    // =========================
    // DELETE MASTER RECORD
    // =========================
    await MasterEmployee.deleteOne({
      _id: masterRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",

      deletedFrom: masterRecord.sourceModel,

      data: deletedEmployee,
    });
  } catch (err) {
    console.error("DELETE_EMPLOYEE_ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUsersByRoles = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },

      { $unwind: "$roleData" },

      {
        $match: {
          "roleData.role_name": {
            $in: [
              "Reporting Officer",
              "Reviewing Officer",
              "Accepting Officer",
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,
          firstName: 1, // ✅ FIXED
          role_name: "$roleData.role_name",
        },
      },
    ]);

    const grouped = {
      reportingOfficers: [],
      reviewingOfficers: [],
      acceptingOfficers: [],
    };

    users.forEach((user) => {
      const formattedUser = {
        _id: user._id,
        name: user.firstName, // ✅ FIXED
      };

      if (user.role_name === "Reporting Officer") {
        grouped.reportingOfficers.push(formattedUser);
      }

      if (user.role_name === "Reviewing Officer") {
        grouped.reviewingOfficers.push(formattedUser);
      }

      if (user.role_name === "Accepting Officer") {
        grouped.acceptingOfficers.push(formattedUser);
      }
    });

    return res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const createBasicEmployee = async (req, res, next) => {
  try {
    const employee = await basicemployeeService.createEmployee({
      body: req.body,
      userId: req.user?._id,
    });

    const { password, refreshToken, ...safeEmployee } = employee.toObject();

    return res.status(201).json({
      success: true,
      source: "EmployeeNew",
      message: "Employee created successfully",
      data: safeEmployee,
    });
  } catch (error) {
    next(error); // 👈 global error handler ko pass
  }
};
export const createDetailedEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.createEmployee(req);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result,
    });
  } catch (err) {
    next(err); // 👈 IMPORTANT: pass to global error middleware
  }
};
export const updateEmployeeController = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const userId = req.user?.id;

    const updatedEmployee = await updatebasicemployeeService.updateEmployee({
      employeeId,
      body: req.body,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    next(err); // 👈 send to global error handler
  }
};
export const getEmployeeNewById = async (req, res) => {
  try {
    const { id } = req.params;

    const emp = await EmployeeNew.findById(id)
      .populate("category role designations")
      .lean();

    if (!emp) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.json({
      success: true,
      data: employeeNewDTO(emp),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmployeeDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const emp = await EmployeeDetail.findById(id)
      .populate("category role designations")
      .lean();

    if (!emp) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.json({
      success: true,
      data: employeeDTO(emp),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEmployeeDetail = async (req, res, next) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const result = await updateemployeeService.updateEmployee(req);

    console.log("UPDATE RESULT:", result);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result,
    });
  } catch (error) {
    next(error); // 👈 global error handler ko pass
  }
};
export const loginEmployee = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone Number and Password required",
      });
    }

    identifier = identifier.trim();

    // =========================
    // DETECT EMAIL OR PHONE
    // =========================
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { phoneNumber: identifier };

    // =========================
    // FIND EMPLOYEE
    // =========================
    const emp = await MasterEmployee.findOne(query)
      .select("+password")
      .populate("role");

    // =========================
    // NOT FOUND
    // =========================
    if (!emp) {
      return res.status(404).json({
        success: false,
        message: isEmail
          ? "Employee email not found"
          : "Employee phone number not found",
      });
    }

    // =========================
    // PASSWORD CHECK
    // =========================
    const isMatch = await emp.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // =========================
    // OPTIONAL: ACTIVE CHECK (BEST PRACTICE)
    // =========================
    if (emp.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    // =========================
    // LOGIN LOG (OPTIONAL)
    // =========================
    await MasterEmployee.updateOne(
      { _id: emp._id },
      {
        lastLoginDate: new Date(),
        lastLoginTime: new Date().toLocaleTimeString(),
      }
    );

    // =========================
    // TOKEN RESPONSE
    // =========================
    return empToken(emp, 200, res);

  } catch (err) {
    console.error("Employee Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getEmployeeFullDataById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid Employee ID is required",
      });
    }

    const matchStage = {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    };

    const buildPipeline = (sourceName) => [
      matchStage,

      // ===== DESIGNATION =====
      {
        $lookup: {
          from: "designations",
          localField: "designations",
          foreignField: "_id",
          as: "designation",
        },
      },
      { $unwind: { path: "$designation", preserveNullAndEmptyArrays: true } },

      // ===== CATEGORY =====
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // ===== ROLE =====
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

      // ===== USERS =====
      {
        $lookup: {
          from: "users",
          localField: "authorities.reporting.name",
          foreignField: "_id",
          as: "reportingUsers",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "authorities.reporting.designation",
          foreignField: "_id",
          as: "reportingDesignations",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "authorities.reviewing.name",
          foreignField: "_id",
          as: "reviewingUsers",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "authorities.reviewing.designation",
          foreignField: "_id",
          as: "reviewingDesignations",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "authorities.accepting.name",
          foreignField: "_id",
          as: "acceptingUsers",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "authorities.accepting.designation",
          foreignField: "_id",
          as: "acceptingDesignations",
        },
      },

      // 🔥 NEW: DEPARTMENTS (FOR NESTED AUTHORITIES)
      {
        $lookup: {
          from: "departments",
          localField: "authorities.reporting.department",
          foreignField: "_id",
          as: "reportingDepartments",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "authorities.reviewing.department",
          foreignField: "_id",
          as: "reviewingDepartments",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "authorities.accepting.department",
          foreignField: "_id",
          as: "acceptingDepartments",
        },
      },

      // ===== FINAL TRANSFORM =====
      {
        $addFields: {
          source: sourceName,

          "authorities.reporting": {
            $map: {
              input: "$authorities.reporting",
              as: "r",
              in: {
                from: "$$r.from",
                to: "$$r.to",

                name: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reportingUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$r.name"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.firstName",
                  },
                },

                designation: {
                  $let: {
                    vars: {
                      des: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reportingDesignations",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.designation"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$des.name",
                  },
                },

                // 🔥 DEPARTMENT ADDED
                department: {
                  $let: {
                    vars: {
                      dep: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reportingDepartments",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.department"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$dep.department_name",
                  },
                },
              },
            },
          },

          "authorities.reviewing": {
            $map: {
              input: "$authorities.reviewing",
              as: "r",
              in: {
                from: "$$r.from",
                to: "$$r.to",

                name: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reviewingUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$r.name"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.firstName",
                  },
                },

                designation: {
                  $let: {
                    vars: {
                      des: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reviewingDesignations",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.designation"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$des.name",
                  },
                },

                // 🔥 DEPARTMENT
                department: {
                  $let: {
                    vars: {
                      dep: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reviewingDepartments",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.department"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$dep.department_name",
                  },
                },
              },
            },
          },

          "authorities.accepting": {
            $map: {
              input: "$authorities.accepting",
              as: "r",
              in: {
                from: "$$r.from",
                to: "$$r.to",

                name: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$acceptingUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$r.name"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.firstName",
                  },
                },

                designation: {
                  $let: {
                    vars: {
                      des: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$acceptingDesignations",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.designation"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$des.name",
                  },
                },

                // 🔥 DEPARTMENT
                department: {
                  $let: {
                    vars: {
                      dep: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$acceptingDepartments",
                              as: "d",
                              cond: { $eq: ["$$d._id", "$$r.department"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$dep.department_name",
                  },
                },
              },
            },
          },
        },
      },
    ];

    const employeeNew = await EmployeeNew.aggregate(buildPipeline("EmployeeNew"));
    const employeeDetail = await EmployeeDetail.aggregate(buildPipeline("EmployeeDetail"));

    const data = [...employeeNew, ...employeeDetail];

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("GET_EMPLOYEE_BY_ID_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await MasterEmployee.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getCurrentEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee not found in token",
      });
    }

    // 🔥 helper function (avoid duplicate code)
    const buildEmployeeQuery = (query) => {
      return query
        .populate("designation", "name")
                .populate("designation", "name")

        
        .lean();
    };

    // 🔥 TRY EmployeeNew FIRST
    let employee = await buildEmployeeQuery(
      EmployeeNew.findById(employeeId)
    );

    // 🔥 IF NOT FOUND → TRY EmployeeDetail
    if (!employee) {
      employee = await buildEmployeeQuery(
        EmployeeDetail.findById(employeeId)
      );
    }

    // ❌ STILL NOT FOUND
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found in both collections",
      });
    }

    // 🔥 CURRENT REPORTING OFFICER (LATEST ACTIVE)
    const reportingOfficer =
      employee.authorities?.reporting?.find((r) => !r.to) || null;

    return res.status(200).json({
      success: true,
      data: {
        employeeCode: employee.employeeCode,
        employeeName: employee.employee_name,
        email: employee.email,

        designation: employee.designation?.name || null,
        department: reportingOfficer?.department?.name || null,

        reportingOfficerName: reportingOfficer?.name?.name || null,
        reportingOfficerDesignation:
          reportingOfficer?.designation?.name || null,

        profilePic: employee.profilePic || null,
      },
    });
  } catch (error) {
    console.error("Employee Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSourceModel = (sourceModel) => {
  const map = {
    EmployeeNew,
    EmployeeDetail,
  };
  return map[sourceModel];
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    // req.user auth middleware se aayega (JWT verify ke baad)
    const employeeCode = req.user?.employeeCode;

    if (!employeeCode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Sabhi fields required hain",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // 1. MasterEmployee find karo
    const masterEmployee = await MasterEmployee.findOne({ employeeCode });
    if (!masterEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // 2. sourceModel dhundo
    const SourceModel = getSourceModel(masterEmployee.sourceModel);
    if (!SourceModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid sourceModel",
      });
    }

    const sourceDoc = await SourceModel.findById(masterEmployee.employeeRefId);
    if (!sourceDoc) {
      return res.status(404).json({
        success: false,
        message: "Source employee record not found",
      });
    }

    // 3. Source model me plain password set karo — pre-save hook hash karega
    sourceDoc.password = newPassword;
    await sourceDoc.save();

    // 4. MasterEmployee me wahi hash copy karo
    masterEmployee.password = sourceDoc.password;
    await masterEmployee.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};