import mongoose from "mongoose";
import User from "../models/userModel.js";

const SelfAppraisalSchema = new mongoose.Schema(
  {

    currentFinancialYear: {
  type: String,
  default: () => {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Financial year April se start
    if (currentMonth >= 4) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  },
},



    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // 1. Responsibilities
    responsibilities: {
      type: String,
      maxlength: 1000,
      trim: true,
    },

    // 2. MOU Targets
    mouWeightage: {
      type: Number,
      enum: [25, 20, 15],
    },

    mouDeliverables: {
      type: String,
      trim: true,
    },

    mouAchievement: {
      type: String,
      trim: true,
    },
totalTaskWeightage: {
  type: Number,
  enum: [50, 55, 60],
},
    

    // Tasks
    tasks: {
      type: [
        {
          taskName: {
            type: String,
            required: true,
            trim: true,
          },

          weightage: {
            type: Number,
            required: true,
          },

          deliverables: {
            type: String,
            trim: true,
          },

          achievement: {
            type: String,
            trim: true,
          },
        },
      ],
      validate: [
        (val) => val.length <= 10,
        "Maximum 10 tasks allowed",
      ],
    },


    // 3. Exceptional Contribution
    exceptionalContribution: {
      type: String,
      maxlength: 1000,
      trim: true,
    },


     officerSignature: {
            url: {
                type: String,
                trim: true,
            },

            public_id: {
                type: String,
                trim: true,
            },

            originalName: {
                type: String,
                trim: true,
            },

            mimeType: {
                type: String,
                trim: true,
            },

            size: {
                type: Number,
            },
        },
    // 4. Constraints
    constraints: {
      type: String,
      maxlength: 1000,
      trim: true,
    },

    // 5. Training
    currentAssignmentTraining: {
      type: String,
      trim: true,
    },

    futureCareerTraining: {
      type: String,
      trim: true,
    },

    // ================= DECLARATION (FRONTEND SAFE) =================

    immovablePropertyReturnFiled: {
      type: Boolean,
      default: false,
      set: (v) => {
        if (typeof v === "string") return v === "yes";
        return Boolean(v);
      },
    },

    
employeeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "MasterEmployee",
  required: true,
  index: true,
},

 // 🔥 ADD THIS FIELD
  reportingOfficerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ya jo bhi officer collection hai
    required: true,
  },
  department: {
        type: mongoose.Schema.Types.ObjectId,
  
        ref: "Department",
  
      },
    immovablePropertyReturnDate: {
      type: Date,
      set: (v) => (v ? new Date(v) : null),
    },

    medicalCheckupDone: {
      type: Boolean,
      default: false,
      set: (v) => {
        if (typeof v === "string") return v === "yes";
        return Boolean(v);
      },
    },

    annualWorkPlanSetForOfficers: {
      type: Boolean,
      default: false,
      set: (v) => {
        if (typeof v === "string") return v === "yes";
        return Boolean(v);
      },
    },

    calculatedTotalTaskWeightage: {
  type: Number,
  default: 0,
},

calculatedGrandTotal: {
  type: Number,
  default: 0,
},

  },
  {
    timestamps: true,
  }
);

/* =========================
   Model Export
========================= */

const SelfAppraisal =
  mongoose.models.SelfAppraisal ||
  mongoose.model(
    "SelfAppraisal",
    SelfAppraisalSchema,
    "selfappraisals"
  );

export default SelfAppraisal;