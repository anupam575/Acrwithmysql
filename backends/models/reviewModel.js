import mongoose from "mongoose";

const sectionIVSchema = new mongoose.Schema(
  {
    assessmentAgree1: {
      type: String,
      enum: ["Yes", "No"],
    },
 employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterEmployee",
      required: true,
    },
    assessmentAgree2: {
      type: String,
      enum: ["Yes", "No"],
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
 reviewingOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    differenceReason: {
      type: String,
      default: "",
    },

    penPictureComments: {
      type: String,
      default: "",
    },

    overallGrade: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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

    nameDesignation: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.models.SectionIV ||
  mongoose.model("SectionIV", sectionIVSchema);