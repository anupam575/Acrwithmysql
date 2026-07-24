import mongoose from "mongoose";

const ReviewingOfficerSchema = new mongoose.Schema(
  {
    reviewAssessment: {
      type: String,
      enum: ["Agree", "Disagree"],
      default: "",
      trim: true,
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
    reviewRemarks: {
      type: String,
      default: "",
      trim: true,
    },
 reviewingOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewTotalScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    employeeId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "MasterEmployee",
              required: true,
            },

    reviewPlace: {
      type: String,
      default: "",
      trim: true,
    },

    reviewDate: {
      type: Date,
      default: null,
    },

    reviewName: {
      type: String,
      default: "",
      trim: true,
    },

    reviewDesignation: {
      type: String,
      default: "",
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
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.ReviewingOfficer ||
  mongoose.model("ReviewingOfficer", ReviewingOfficerSchema);