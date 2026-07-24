import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import MasterEmployee from "../models/masterEmployee.js";

const employeeDetailSchema = new mongoose.Schema(
    {

        recentPhotograph: {

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
        // Basic Details
        employeeCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        EmployeeName: String,
        dateOfBirth: Date,

        academicProfessionalQualifications: {
            type: String,
            trim: true,
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

      phoneNumber: {
  type: String,
  required: [true, "Phone number is required"],
  trim: true,
  unique: true,
},
        currentPost: {
            postName: String,
            grade: String,
            payScale: String,
            nsfdcAppointmentDate: Date,
        },

        firstPublicEnterpriseAppointment: {
            date: Date,
            payScale: String,
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
        absenceRecords: [
            {
                from: Date,
                to: Date,

                category: {
                    type: String,
                    enum: ["Leave", "Others"],
                },

                leaveType: {
                    type: String,
                    enum: [
                        "Casual Leave",
                        "Earned Leave",
                        "Medical Leave",
                        "On leave other than Casual Leave",
                        "Other"
                    ],
                },

                specify: {
                    type: String, // for "Others (specify)"
                },

                remarks: String,
            },
        ],

        // detailedQualifications: [
        //     {
        //         qualification: String,
        //         institution: String,
        //         subjects: String,
        //         marksObtained: String,
        //     },
        // ],




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



        trainingPrograms: [
            {
                from: Date,
                to: Date,
                institute: String,
                subject: String,
            },
        ],



        awards: [
            {
                title: String,
                description: String,
                year: Number,
            },
        ],

        officersNotReportedPAR: {
            type: Number,
            default: 0,
        },



        propertyReturnDate: Date,
        propertyReturnYear: Number,

        // medicalExamination: {

        //     // Date of examination
        //     date: {
        //         type: Date,
        //     },

        //     // Optional short remarks/summary
        //     reportSummary: {
        //         type: String,
        //         trim: true,
        //     },

        //     // Attached report file/pdf
        //     reportDocument: {

        //         url: {
        //             type: String,
        //             trim: true,
        //         },

        //         public_id: {
        //             type: String,
        //             trim: true,
        //         },

        //         originalName: {
        //             type: String,
        //             trim: true,
        //         },

        //         mimeType: {
        //             type: String,
        //             trim: true,
        //         },

        //         size: {
        //             type: Number,
        //         },
        //     },
        // },
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
        // personnelOfficer: {
        //     name: String,
        //     designation: String,
        // },


        refreshToken: {     // ✅ FIX ADDED
            type: String,
            select: false,
        },

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

employeeDetailSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});
const EmployeeDetail = mongoose.model("EmployeeDetail", employeeDetailSchema);

export default EmployeeDetail;