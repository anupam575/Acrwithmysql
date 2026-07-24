// routes/userRoutes.js
import express from "express";
import {
  
  loginUser,
  logout,
  refreshToken,
  getUserDetails,
  updateUserProfile,
  updatePassword,
  
  verifyEmailController,
  resendOtpController,
  forgotPassword,
    resetPassword,





} from "../controller/usercontroller.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer middleware

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", isAuthenticatedUser, logout);
router.get("/refresh-token", refreshToken);

// ✅ Get user details (protected route)
router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/password/update", isAuthenticatedUser, updatePassword);

router.post("/verify-email", verifyEmailController);

// ✅ Route to resend OTP
// POST /api/auth/resend-otp
router.post("/resend-otp", resendOtpController);

router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);
router.put(
  "/me/update",
  isAuthenticatedUser,
  upload.single("profileImage"), // Optional, if user uploads new profile pic
  updateUserProfile
);

export default router;