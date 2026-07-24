// routes/selfAppraisalRoutes.js

import express from "express";

import {
  createSelfAppraisal,
  getAllSelfAppraisals,
  getSingleSelfAppraisal,
  viewEmployeeDetails,
  updateSelfAppraisal,
  deleteSelfAppraisal,
  getReportingOfficers,
    viewEmployeeDetail,
    viewapprisalDetails

} from "../controller/selfAppraisalController.js";

import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router();

/* =========================
   CREATE SELF APPRAISAL
========================= */

router.post(
  "/create",upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]), 
  isAuthenticatedUser,
  createSelfAppraisal
);

router.get("/view/:appraisalId", viewapprisalDetails);

/* =========================
   VIEW EMPLOYEE DETAILS
========================= */

router.get(
  "/viewer/:employeeId",
    isAuthenticatedUser,

  viewEmployeeDetails
);



router.get(
  "/views/:employeeId",

  viewEmployeeDetail
);

/* =========================
   REPORTING OFFICERS
   (IMPORTANT: keep before /:id)
========================= */

router.get(
  "/reporting-officers",
    isAuthenticatedUser,

  getReportingOfficers
);

/* =========================
   GET ALL SELF APPRAISALS
========================= */

router.get(
  "/all",
  isAuthenticatedUser,
  getAllSelfAppraisals
);

/* =========================
   GET SINGLE SELF APPRAISAL
========================= */

router.get(
  "/:id",
  isAuthenticatedUser,
  getSingleSelfAppraisal
);

/* =========================
   UPDATE SELF APPRAISAL
========================= */

router.put(
  "/update/:id",
  isAuthenticatedUser,
  updateSelfAppraisal
);

/* =========================
   DELETE SELF APPRAISAL
========================= */

router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  deleteSelfAppraisal
);

export default router;