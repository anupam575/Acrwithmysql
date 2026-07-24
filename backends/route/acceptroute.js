import express from "express";
import { createAcceptanceSection,getEmployeeAcceptanceData,getEmployeeAcceptanceid, createAcceptingAuthority,getEmployeeAcceptance } from "../controller/acceptcontroller.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router();

router.post("/acceptance-section",  upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser, createAcceptanceSection);
router.get(
  "/employee/acceptance",isAuthenticatedUser,
  getEmployeeAcceptanceData
);

router.get(
  "/employee/acceptanceid/:employeeId",
  getEmployeeAcceptanceid
);

router.get(
  "/employeer/acceptanceid/:employeeId",
  getEmployeeAcceptance
);

router.post("/acceptancer",  upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser, createAcceptingAuthority);
export default router;