import express from 'express'
import { createSectionIVController,   getReviewByEmployeeIdController,createReviewingOfficer,getReviewByEmployeeId
 } from '../controller/reviewingcontroller.js';
import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router()

// ======================================================
// CREATE SECTION IV RECORD
// ======================================================

router.get(
  "/employee/:employeeId",
  getReviewByEmployeeIdController
);


router.get(
  "/employeer/:employeeId",
  getReviewByEmployeeId
);

router.post('/create', upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser,createSectionIVController)

router.post('/creater', upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser,createReviewingOfficer)

export default router