import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import MasterEmployee from "../models/masterEmployee.js";

export const isAuthenticatedUser = async (
  req,
  res,
  next
) => {
  try {

    /* =====================================
       GET TOKEN
    ===================================== */

    const authHeader =
      req.headers.authorization;

    const token =
      req.cookies?.accessToken ||
      (authHeader &&
        authHeader.split(" ")[1]);

    /* =====================================
       TOKEN MISSING
    ===================================== */

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token missing",
      });
    }

    let decoded;

    /* =====================================
       VERIFY TOKEN
    ===================================== */

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (err) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token",
      });
    }

    /* =====================================
       DEFAULT VALUES
    ===================================== */

    let user = null;
    let isEmployee = false;

    /* =====================================
       NORMAL USER LOGIN
    ===================================== */

    if (decoded.type !== "employee") {

      user = await User.findById(
        decoded.id
      ).populate("role");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
    }

    /* =====================================
       EMPLOYEE LOGIN
    ===================================== */

    if (decoded.type === "employee") {

      isEmployee = true;

      /* ===============================
         CHECK employeeRefId
      =============================== */

      if (!decoded.employeeRefId) {
        return res.status(401).json({
          success: false,
          message:
            "Employee reference ID missing in token",
        });
      }

      /* ===============================
         FIND REAL EMPLOYEE
      =============================== */

      user = await MasterEmployee.findOne({
        employeeRefId:
          decoded.employeeRefId,
      }).populate("role");

      /* ===============================
         EMPLOYEE NOT FOUND
      =============================== */

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Employee not found",
        });
      }
    }

    /* =====================================
       ACTIVE CHECK
    ===================================== */

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Account is deactivated",
      });
    }

    /* =====================================
       ATTACH CLEAN USER
    ===================================== */

    req.user = user;

    req.employeeRefId =
      decoded.employeeRefId || null;

    req.isEmployee = isEmployee;

    next();

  } catch (err) {

    console.error(
      "❌ Auth Middleware Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error in authentication",
    });
  }
};
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Get role_key from populated role
      const userRoleKey = req.user.role?.role_key;

      if (!userRoleKey) {
        return res.status(403).json({
          success: false,
          message: "User role not found",
        });
      }

      // Normalize role (DB stores lowercase)
      const normalizedRole = userRoleKey.toLowerCase();

      // Normalize allowed roles once
      const normalizedAllowedRoles = allowedRoles.map(role =>
        role.toLowerCase()
      );

      // Check permission
      if (!normalizedAllowedRoles.includes(normalizedRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error in role authorization",
      });
    }
  };
};