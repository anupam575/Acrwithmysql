// models/PerformanceReview.js

import mongoose from "mongoose";

const performanceFactorSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    weightage: {
      type: Number,
      required: true,
    },
    reportingOfficer: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: false }
);

const otherAspectSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    weightage: {
      type: Number,
      required: true,
    },
    reportingOfficer: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: false }
);

const performanceReviewSchema = new mongoose.Schema(
  {
    // ==========================
    // Performance Factors
    // ==========================
    performanceFactors: {
      type: [performanceFactorSchema],
      default: [],
    },

    // ==========================
    // Other Aspects
    // ==========================
    otherAspects: {
      type: [otherAspectSchema],
      default: [],
    },

    // ==========================
    // Career Development
    // ==========================
    careerDevelopment: {
      type: [String],
      default: [],
    },
reportingOfficerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // ya jis collection me reporting officer hai
  required: true,
},
    otherCareerField: {
      type: String,
      default: "",
      trim: true,
    },employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MasterEmployee",
          required: true,
        },
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


    // ==========================
    // Part III
    // ==========================
    trainingRecommendation: {
      type: String,
      default: "",
      trim: true,
    },

    officialLanguageWork: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // Part IV
    // ==========================
    generalHealth: {
      type: String,
      default: "",
      trim: true,
    },
    
    integrity: {
      type: String,
      enum: ["Above Board", "Questionable", ""],
      default: "",
    },

    promotionPotential: {
      type: String,
      default: "",
      trim: true,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================
    // Reporting Officer
    // ==========================
    place: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
    },

    reportingOfficerName: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PerformanceReview",
  performanceReviewSchema
);