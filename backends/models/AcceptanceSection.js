import mongoose from "mongoose";

const acceptanceSectionSchema = new mongoose.Schema(
  {
    overallGradeConsistent: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
 employeeId: {
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
     reviewingOfficerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

    agreeWithRemarks: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },

    differenceOpinion: {
      type: String,
      trim: true,
      default: "",
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


        
    overallGrade: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{1,3}(\.\d{1,2})?$/.test(v.toString());
        },
        message: "Max 2 decimal places allowed",
      },
    },


    acceptingAuthorityNameDesignation: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ MODEL
const AcceptanceSection = mongoose.model(
  "AcceptanceSection",
  acceptanceSectionSchema
);

// ✅ DEFAULT EXPORT (IMPORTANT FIX)
export default AcceptanceSection;