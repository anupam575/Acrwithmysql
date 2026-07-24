import mongoose from "mongoose";

const AcceptingAuthoritySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterEmployee",
      required: true,
    },

    acceptingAuthorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    

    acceptingAssessment: {
      type: String,
      enum: ["Agree", "Disagree"],
      default: "",
      trim: true,
    },

    acceptingRemarks: {
      type: String,
      default: "",
      trim: true,
    },

    acceptingTotalScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    acceptingPlace: {
      type: String,
      default: "",
      trim: true,
    },

    acceptingDate: {
      type: Date,
      default: null,
    },

    acceptingName: {
      type: String,
      default: "",
      trim: true,
    },

    acceptingDesignation: {
      type: String,
      default: "",
      trim: true,
    },

    officerSignature: {
      url: {
        type: String,
        trim: true,
        default: "",
      },

      public_id: {
        type: String,
        trim: true,
        default: "",
      },

      originalName: {
        type: String,
        trim: true,
        default: "",
      },

      mimeType: {
        type: String,
        trim: true,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate records for same employee + authority + financial year
AcceptingAuthoritySchema.index(
  {
    employeeId: 1,
    acceptingAuthorityId: 1,
    currentFinancialYear: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.AcceptingAuthority ||
  mongoose.model(
    "AcceptingAuthority",
    AcceptingAuthoritySchema
  );