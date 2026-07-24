import express from "express";

import {
  createSupervisor,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
  viewEmployeeDetails,
  viewEmployeeDetail,
  viewapprisalDetails
} from "../controller/supervisorcontroller.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router();

router.post("/create",  upload.fields([
    { name: "officerSignature", maxCount: 1 },
  ]),  isAuthenticatedUser,createSupervisor);

router.get("/all", isAuthenticatedUser, getAllSupervisors);

router.get(
  "/view/:employeeId",
    isAuthenticatedUser,

  viewEmployeeDetails
);

router.get(
  "/view/:employeeId",
    isAuthenticatedUser,

  viewEmployeeDetails
);
router.get(
  "/details/:employeeId",

  viewEmployeeDetail
);
router.get("/:id", isAuthenticatedUser, getSupervisorById);


router.get("/viewer/:appraisalId", viewapprisalDetails);

router.put("/:id", isAuthenticatedUser, updateSupervisor);

router.delete("/delete/:id", isAuthenticatedUser, deleteSupervisor);

export default router;