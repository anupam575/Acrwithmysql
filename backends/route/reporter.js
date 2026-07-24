import express from 'express'

import { createReporterApar, getReportByEmployee, createPerformanceReview,getsupByEmployee } from '../controller/reportcontrller.js';
import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router()

// ======================================================
// CREATE REPORTER APAR
// ======================================================
router.get("/report/:employeeId",  
 getReportByEmployee);

router.get("/reporter/:employeeId",  
 getsupByEmployee);

router.post('/create', upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser, createReporterApar)

router.post('/creater', upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), isAuthenticatedUser,createPerformanceReview)

export default router