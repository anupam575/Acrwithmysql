
import mongoose from "mongoose";

const SupervisorSchema = new mongoose.Schema(
  {
    tasks: {
      type: String,
      required: true,
      trim: true,
    },
  name: {
  type: String,
  required: true,
  trim: true,
},

designation: {
  type: String,
  required: true,
  trim: true,
},
    achievements: {
      type: String,
      required: true,
      trim: true,
    },

    shortfalls: {
      type: String,
      required: true,
      trim: true,
    },

    higherAchievements: {
      type: String,
      required: true,
      trim: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
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
    
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reportingOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
 department: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Department",

    },
    financialYear: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);

const Supervisor = mongoose.model("Supervisor", SupervisorSchema);

export default Supervisor;

