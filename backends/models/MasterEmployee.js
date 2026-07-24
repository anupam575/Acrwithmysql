import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const masterEmployeeSchema = new mongoose.Schema(
  {
    employeeRefId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "sourceModel",
      index: true,
    },

    sourceModel: {
      type: String,
      required: true,
      enum: ["EmployeeNew", "EmployeeDetail"],
    },

    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },


    designations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
      },
    ],

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    authorities: {
      reporting: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
          },
          from: Date,
          to: Date,
        }
      ],

      reviewing: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
          },
          from: Date,
          to: Date,
        }
      ],

      accepting: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
          },
          from: Date,
          to: Date,
        }
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
// password compare method
masterEmployeeSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// safe model register
const MasterEmployee =
  mongoose.models.MasterEmployee ||
  mongoose.model("MasterEmployee", masterEmployeeSchema);

export default MasterEmployee;