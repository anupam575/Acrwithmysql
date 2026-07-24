import express from "express";
import {
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} from "../controller/designationController.js";

const router = express.Router();

router.post("/create", createDesignation);

// GET ALL
router.get("/get", getDesignations);

// GET SINGLE
router.get("/:id", getDesignationById);

// UPDATE
router.put("/:id", updateDesignation);

// DELETE
router.delete("/:id", deleteDesignation);

export default router;