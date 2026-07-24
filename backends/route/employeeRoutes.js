import express from "express";

import {
  createBasicEmployee,
  updateEmployeeController,
  deleteEmployee,
  getUsersByRoles,
  updateEmployeeDetail,
  createDetailedEmployee,
   getEmployeeNewById,
  getEmployeeDetailById,
  loginEmployee,
  getEmployeeFullDataById,
  getEmployeesByUserRoleMatch,
  getAllMasterEmployees,
  getCurrentEmployeeProfile,
  getEmployeesByUserRoleMatches,
  getDashboardStats,
  getAllMasterEmployee,
  getAllFinancialYears,
  getEmployeesByUserRoleMatching,
  getFinancialYearsByUserRoleMatch,
  getFinancialYearsByUserRoleMatches,
  changePassword,
  getFinancialYearsByUserRoleMatching
} from "../controller/hrcontrloler.js";

import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router();
router.get("/dashboard/stats", getDashboardStats);

router.post("/create/basic", isAuthenticatedUser, createBasicEmployee);
router.get("/master-employee", getAllMasterEmployees);
router.get("/master-employ", getAllMasterEmployee);

router.get("/by-user-role-match/financial-years",  isAuthenticatedUser,              // 👈 ye add karna zaroori hai
 getFinancialYearsByUserRoleMatch);
router.get("/by-user-role-matches/financial-years",  isAuthenticatedUser,              // 👈 ye add karna zaroori hai
 getFinancialYearsByUserRoleMatches);
router.get("/by-user-role-matching/financial-years",  isAuthenticatedUser,              // 👈 ye add karna zaroori hai
 getFinancialYearsByUserRoleMatching);
router.get("/by-user-role-match",  isAuthenticatedUser,
 getEmployeesByUserRoleMatch);

router.get("/financial-years", getAllFinancialYears); // 👈 naya route add karo
 
router.get("/by-user-role-matching",  isAuthenticatedUser,
 getEmployeesByUserRoleMatching);
router.get("/by-user-role-matches",  isAuthenticatedUser,
 getEmployeesByUserRoleMatches);

router.get("/full/:id", getEmployeeFullDataById);
router.put("/change-password",isAuthenticatedUser, changePassword);

router.post(
  "/create/detailed",
  isAuthenticatedUser,
  upload.fields([
    { name: "recentPhotograph", maxCount: 1 },
    { name: "officerSignature", maxCount: 1 },
    { name: "reportDocument", maxCount: 1 }
  ]),
  createDetailedEmployee
);


router.get("/employee/profile", isAuthenticatedUser, getCurrentEmployeeProfile);

router.get("/employee-new/:id", getEmployeeNewById);

router.get("/employee-detail/:id",   getEmployeeDetailById,
);
// ✅ GET EmployeeDetail by ID
// ===============================
  
router.post("/login", loginEmployee);

// ===============================
// ✅ UPDATE BASIC EMPLOYEE
// ===============================
router.put("/:id", isAuthenticatedUser, updateEmployeeController);

// =======router.put(
  router.put("/details/:id",
  isAuthenticatedUser,
  upload.fields([
  { name: "recentPhotograph", maxCount: 1 },
  { name: "officerSignature", maxCount: 1 },
  { name: "reportDocument", maxCount: 1 }
]),
  updateEmployeeDetail
);
// ✅ DELETE EMPLOYEE
// ===============================
router.delete("/:id", isAuthenticatedUser, deleteEmployee);

// ===============================
// 🔥 GET USERS BY ROLE
// ===============================
router.get("/users/par-roles", getUsersByRoles);

export default router;