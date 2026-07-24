import mongoose from "mongoose";

const AparSchema = new mongoose.Schema(
  {
    // ======================================================
    // SECTION 1 - 5
    // ======================================================
    section1: { type: String, default: "" },
    section2: { type: String, default: "" },
    section3: { type: String, default: "" },
    section4: { type: String, default: "" },
    section5: { type: String, default: "" },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterEmployee",
      required: true,
    },
     reportingOfficerId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User", // ya jo bhi officer collection hai
       required: true,
     },
     department: {
           type: mongoose.Schema.Types.ObjectId,
     
           ref: "Department",
     
         },
    financialYear: {
      type: String,
      required: true, // e.g. 2025-2026
    },

    section6: {
      mou: {
        weightage: { type: Number, default: 0 },
        reportingAbsolute: { type: Number, default: 0 },

        // frontend sends this
        reportingWeighted: {
          type: Number,
          default: 0,
        },
        initials: { type: String, default: "" },
      },

      tasks: [
        {
          taskName: {
            type: String,
            default: "",
          },

          weightage: {
            type: Number,
            default: 0,
          },

          reportingAbsolute: {
            type: Number,
            default: 0,
          },

          reportingWeighted: {
            type: Number,
            default: 0,
          },
          initials: {
            type: String,
            default: "",
          },
        },
      ],

      totalWeightage: {
        type: Number,
        default: 0,
      },

      totalReportingAbsolute: {
        type: Number,
        default: 0,
      },

      totalReportingWeighted: {
        type: Number,
        default: 0,
      },

      grandWeightage: {
        type: Number,
        default: 0,
      },

      grandReportingAbsolute: {
        type: Number,
        default: 0,
      },

      grandReportingWeighted: {
        type: Number,
        default: 0,
      },
    },

    // ======================================================
    // SECTION 7
    // ======================================================
    section7: [
      {
        slNo: {
          type: String,
          default: "",
        },

        competency: {
          type: String,
          default: "",
        },

        // EXACT frontend field name
        reportingAuthority: {
          type: Number,
          default: 0,
        },

        initials: {
          type: String,
          default: "",
        },
      },
    ],

    // ======================================================
    // SUMMARY
    // ======================================================
    summary: {
      total: {
        type: Number,
        default: 0,
      },

      overall: {
        type: Number,
        default: 0,
      },
    },

    // ======================================================
    // SECTION 8
    // ======================================================
    integrity: {
      beyondDoubt: {
        type: String,
        default: "",
      },

      doubtful: {
        type: String,
        default: "",
      },

      nothingAdverse: {
        type: String,
        default: "",
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
    // ======================================================
    // SECTION 9
    // ======================================================
    penPicture: {
      type: String,
      default: "",
    },

    // ======================================================
    // SECTION 10
    // ======================================================
    overallGrade: {
      type: Number,
      default: 0,
    },

    reportingDate: {
      type: Date,
    },

    // ======================================================
    // SIGNATURE
    // ======================================================
    
    designation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const AparModel = mongoose.models.Apar || mongoose.model("Apar", AparSchema);

export default AparModel;
