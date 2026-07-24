import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import MasterEmployee from "../models/masterEmployee.js";
const EmployeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    employee_name: { type: String, trim: true },

    pay_scale: { type: String, trim: true },
    basic_pay: { type: Number },

    date_of_birth: { type: Date },
    date_of_joining: { type: Date },
    date_of_appointment: { type: Date },
    refreshToken: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },
    educationalProfessionalQualifications: {
      education: [
        {
          title: { type: String, trim: true },
          institution: { type: String, trim: true },
          year: { type: Number },
        },
      ],
      professional: [
        {
          title: { type: String, trim: true },
          institution: { type: String, trim: true },
          year: { type: Number },
        },
      ],
      otherDetails: { type: String, trim: true },
    },

    basicTrainings: [
      {
        name: { type: String, trim: true },
        institute: { type: String, trim: true },
        from: { type: Date },
        to: { type: Date },
      },
    ],


    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
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

    profilePic: {
      type: String,
      default: "https://via.placeholder.com/150",
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
          department: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Department",

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
          department: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Department",

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
          department: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Department",

          },
          from: Date,
          to: Date,
        }
      ],
    },

    basicLeaves: [
      {
        type: { type: String, trim: true },
        reason: { type: String, trim: true },
        remarks: { type: String, trim: true },
        from: { type: Date },
        to: { type: Date },
      },
    ],


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },


  },
  {
    timestamps: true,
  }
);





EmployeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});



const EmployeeNew = mongoose.model("EmployeeNew", EmployeeSchema);

export default EmployeeNew;