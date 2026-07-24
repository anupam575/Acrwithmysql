import jwt from "jsonwebtoken"; // ✅ Make sure this is imported
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
import empToken from "../utils/sendEmployeeToken.js";


import MasterEmployee from "../models/MasterEmployee.js";

import EmployeeNew from "../models/employee.js";
import EmployeeDetail from "../models/EmployeeDetail.js";


import sendToken from "../utils/jwtToken.js";
import mongoose from "mongoose"; // ES6 import
import { formatUser } from "../utils/formatUser.js";

import dotenv from 'dotenv';

dotenv.config();

// helper functions
const getEmployeeNewData = async (id) => {
  return await EmployeeNew.findById(id)
    .populate("role designations category");
};

const getEmployeeDetailData = async (id) => {
  return await EmployeeDetail.findById(id)
    .populate("role designations category");
};

export const getUserDetails = async (req, res) => {
  try {
    const { user, isEmployee } = req;

    // 🔥 EMPLOYEE FLOW
    if (isEmployee) {
      const master = await MasterEmployee.findById(user._id);

      if (!master) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      let userData = null;

      if (master.sourceModel === "EmployeeNew") {
        userData = await EmployeeNew.findById(master.employeeRefId)
          .populate("role")
          .populate("designations")
          .populate("category");

      } else if (master.sourceModel === "EmployeeDetail") {
        userData = await EmployeeDetail.findById(master.employeeRefId)
          .populate("role")
          .populate("designations")
          .populate("category");
      }

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "Employee data not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: userData,   // 🔥 RAW DB DATA
        type: "employee",
      });
    }

    // 🔥 NORMAL USER FLOW
    const normalUser = await User.findById(user._id).populate("role");

    if (!normalUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: normalUser,  // 🔥 RAW DB DATA
      type: "user",
    });

  } catch (err) {
    console.error("❌ GetMe Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// export const refreshToken = async (req, res) => {
//   try {
//     const cookieRefreshToken = req.cookies?.refreshToken;

//     if (!cookieRefreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "No refresh token found",
//       });
//     }

//     // 1️⃣ Verify JWT
//     let decoded;
//     try {
//       decoded = jwt.verify(
//         cookieRefreshToken,
//         process.env.REFRESH_TOKEN_SECRET
//       );
//     } catch (err) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid or expired token",
//       });
//     }

//     // 2️⃣ Find user
//     const user = await User.findById(decoded.id);

//     if (!user || !user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "User not valid",
//       });
//     }

//     // 3️⃣ Hash incoming token
//     const hashedIncomingToken = crypto
//       .createHash("sha256")
//       .update(cookieRefreshToken)
//       .digest("hex");

//     // 4️⃣ Compare with DB
//     if (user.refreshToken !== hashedIncomingToken) {
//       return res.status(403).json({
//         success: false,
//         message: "Session invalid or token reused",
//       });
//     }

//     // 5️⃣ Issue new tokens (rotation handled in sendToken)
//     return sendToken(user, 200, res);

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

export const refreshToken = async (req, res) => {
  try {
    const cookieRefreshToken = req.cookies?.refreshToken;

    if (!cookieRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token found",
      });
    }

    let decoded;

    // 🔥 VERIFY TOKEN
    try {
      decoded = jwt.verify(
        cookieRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 🔥 STEP 1: FIND USER (User + Employee)
    let user = await User.findById(decoded.id);
    let isEmployee = false;

    if (!user) {
      user = await MasterEmployee.findById(decoded.id);
      isEmployee = true;
    }

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User inactive",
      });
    }

    // 🔥 STEP 2: ISSUE NEW TOKENS (NO DB CHECK)
    if (isEmployee) {
      return empToken(user, 200, res);
    } else {
      return sendToken(user, 200, res);
    }

  } catch (err) {
    console.error("❌ Refresh Token Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= UPDATE PASSWORD =================

export const updatePassword = async (req, res) => {

  try {

    const {
      newPassword,
      confirmPassword,
    } = req.body;

    // ================= VALIDATION =================

    if (
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }

    // ================= STRONG PASSWORD =================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {

      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number & special character",
      });

    }

    // ================= PASSWORD MATCH =================

    if (
      newPassword !== confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });

    }

    // ================= GET USER FROM MIDDLEWARE =================

    const user = req.user;

    // ================= USER CHECK =================

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // ================= UPDATE PASSWORD =================

    user.password = newPassword;

    await user.save();

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {

    console.error(
      "Update Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


export const registerUser = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      mobileNo,
      dob,
      address1,
      designation,
      gender,
      district,
    } = req.body;

    console.log("📥 Register Request Body:", req.body);

    // ✅ Validation
    if (
      !username?.trim() ||
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !mobileNo?.trim() ||
      !dob ||
      !address1?.trim() ||
      !designation?.trim() ||
      !gender?.trim() ||
      !district?.trim()
    ) {
      console.log("⚠️ Validation failed: missing fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log("✉️ Normalized Email:", normalizedEmail);

    const existingUser = await User.findOne({ Email: normalizedEmail });
    if (existingUser) {
      console.log("⚠️ User already exists:", normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const loginId = normalizedEmail;
    const profilePicPath = req.file
      ? `/uploads/${req.file.filename}`
      : "https://via.placeholder.com/150";

    let Roll_ID = 2;
    let Role = "User";

    if (process.env.ADMIN_EMAIL && normalizedEmail === process.env.ADMIN_EMAIL) {
      Roll_ID = 1;
      Role = "Admin";
    }

    // 🔢 Generate OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 Generated OTP (plaintext):", rawOtp);

    const hashedOtp = await bcrypt.hash(rawOtp, 12);

    const user = await User.create({
      Username: username.trim(),
      Name: name.trim(),
      Email: normalizedEmail,
      LoginPassword: password,
      LoginID: loginId,
      MobileNo: mobileNo.trim(),
      DOB: dob,
      Address1: address1.trim(),
      Designation: designation.trim(),
      Gender: gender,
      District: district.trim(),
      ProfilePic: profilePicPath,
      Roll_ID,
      Role,
      otp: hashedOtp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      emailVerified: false,
    });

    console.log("✅ User created:", user._id);

    // ✉️ Send Email
    await sendEmail({
      to: normalizedEmail,
      subject: "Your OTP Verification",
      text: `Hello ${name},\n\nYour OTP is ${rawOtp}. It will expire in 10 minutes.\n\nThank you!`,
    });
    console.log(`📧 OTP sent to email: ${normalizedEmail}`);

    res.status(201).json({
      success: true,
      message: "User created successfully. OTP sent to your email.",
      user: {
        id: user._id,
        email: user.Email,
        name: user.Name,
      },
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ✅ Verify Email Controller
export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("📥 Verify Email Request:", req.body);

    const user = await User.findOne({ Email: email.toLowerCase().trim() })
      .select("+otp +otpExpiry +emailVerified");

    if (!user) {
      console.log("⚠️ User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      console.log("ℹ️ Email already verified:", email);
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      console.log("⚠️ OTP expired for email:", email);
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      console.log("❌ Invalid OTP for email:", email, "Provided OTP:", otp);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    console.log("✅ Email verified:", email);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ verifyEmailController error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Resend OTP Controller
export const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📥 Resend OTP Request:", req.body);

    if (!email) {
      console.log("⚠️ Email missing in resend request");
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ Email: normalizedEmail }).select("+emailVerified");

    if (!user) {
      console.log("⚠️ User not found for email:", email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.emailVerified) {
      console.log("ℹ️ Email already verified:", email);
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 12);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });
    console.log("🔑 New OTP generated:", rawOtp);

    await sendEmail({
      to: normalizedEmail,
      subject: "Resend Email Verification OTP",
      text: `Hello ${user.Name},\n\nYour new OTP is ${rawOtp}. It expires in 10 minutes.\n\nThank you!`,
    });
    console.log(`📧 OTP resent to email: ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("❌ resendOtpController error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    // =========================
    // VALIDATION (ONLY 2 FIELDS REQUIRED)
    // =========================
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone Number and Password required",
      });
    }

    identifier = identifier.trim();

    // =========================
    // DETECT EMAIL OR PHONE
    // =========================
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    let query;

    if (isEmail) {
      query = { email: identifier.toLowerCase() };
    } else {
      // optional: remove spaces / country code handling later
      query = { phoneNumber: identifier };
    }

    // =========================
    // FIND USER
    // =========================
    const user = await User.findOne(query)
      .select("+password isActive role department empCode")
      .populate("role")
      .populate("department");

    // =========================
    // USER NOT FOUND
    // =========================
    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail
          ? "Invalid Email"
          : "Invalid Phone Number",
      });
    }

    // =========================
    // PASSWORD CHECK
    // =========================
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // =========================
    // ACCOUNT STATUS
    // =========================
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account inactive",
      });
    }

    // =========================
    // LOGIN LOG UPDATE
    // =========================
    await User.updateOne(
      { _id: user._id },
      {
        LOGDATE: new Date(),
        LOGTIME: new Date().toLocaleTimeString(),
      }
    );

    // =========================
    // RESPONSE TOKEN
    // =========================
    return sendToken(user, 200, res);

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (user) {
          await user.clearRefreshToken(); // DB cleanup
        }

      } catch (err) {
        // token invalid → still continue logout
      }
    }

    // clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // ============================================
    // FIND CURRENT USER
    // ============================================
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ============================================
    // HELPER FUNCTION
    // ============================================
    const getString = (field) => {
      if (!field) return "";

      if (Array.isArray(field)) {
        return String(field[0] || "").trim();
      }

      return String(field).trim();
    };

    // ============================================
    // EXTRACT BODY DATA
    // ============================================
    const username = getString(req.body.username);

    const firstName = getString(req.body.firstName);

    const lastName = getString(req.body.lastName);

    const phoneNumber = getString(req.body.phoneNumber);

    const email = getString(req.body.email).toLowerCase();

    const empCode = getString(req.body.empCode);

    // ============================================
    // PROFILE IMAGE UPDATE
    // ============================================
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    // ============================================
    // EMAIL VALIDATION + DUPLICATE CHECK
    // ============================================
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          field: "email",
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    // ============================================
    // EMPLOYEE CODE VALIDATION
    // ============================================
    if (empCode && empCode !== user.empCode) {
      const existingEmpCode = await User.findOne({
        empCode,
        _id: { $ne: userId },
      });

      if (existingEmpCode) {
        return res.status(400).json({
          success: false,
          field: "empCode",
          message: "Employee code already exists",
        });
      }

      user.empCode = empCode;
    }

    // ============================================
    // PHONE NUMBER VALIDATION
    // ============================================
    if (phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          field: "phoneNumber",
          message: "Invalid mobile number",
        });
      }

      const existingPhone = await User.findOne({
        phoneNumber,
        _id: { $ne: userId },
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          field: "phoneNumber",
          message: "Mobile number already exists",
        });
      }

      user.phoneNumber = phoneNumber;
    }

    // ============================================
    // UPDATE NORMAL USER FIELDS
    // ============================================
    if (username) {
      user.username = username;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    // ============================================
    // SAVE USER
    // SKIP FULL VALIDATION
    // (role/department handled by admin only)
    // ============================================
    await user.save({
      validateBeforeSave: false,
    });

    // ============================================
    // FETCH UPDATED USER
    // ============================================
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate("role", "role_name role_key")
      .populate("department", "department_name");

    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    // ============================================
    // MONGO DUPLICATE KEY ERROR
    // ============================================
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,
        field,
        message: `${field} already exists`,
      });
    }

    // ============================================
    // SERVER ERROR
    // ============================================
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email, token } = req.body;

    // ✅ Validate input
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!token) {
      return res.status(400).json({ message: "Captcha token missing" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Verify reCAPTCHA
    const captchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    if (!captchaRes.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed ❌",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ Email: normalizedEmail });

    // ⚠️ Security: don't reveal user existence
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset link has been sent 📧",
      });
    }

    // ✅ Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    // ✅ Save token in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // ✅ Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // ✅ Email template
    const html = `
      <p>Hello ${user.Name},</p>
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link will expire in 30 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // ✅ Send email
    await sendEmail({
      to: user.Email,
      subject: "Reset Your Password",
      html,
    });

    return res.status(200).json({
      success: true,
      message: "Reset password email sent ✅",
    });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: 'Token and new password required' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    // ✅ DON'T hash here
    user.LoginPassword = newPassword;

    // ✅ Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};