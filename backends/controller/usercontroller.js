import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import crypto from 'crypto';

import sendEmail from '../utils/sendEmail.js';
import empToken from '../utils/sendEmployeeToken.js';
import sendToken from '../utils/jwtToken.js';
import { prisma } from '../config/database.js';

import 'dotenv/config';

const userId = (u) => u?._id || u?.id;

// =====================================================
// BIGINT SAFE JSON
// =====================================================
// MySQL BIGINT columns come back from Prisma as JS BigInt,
// which res.json() cannot serialize. This converts every
// BigInt (nested too) into a Number (or a string if it is
// too large to be a safe integer). Dates/Decimals are kept
// as normal JSON values.

const jsonSafe = (data) =>
  data === undefined
    ? data
    : JSON.parse(
        JSON.stringify(data, (_, v) => {
          if (typeof v === 'bigint') {
            const n = Number(v);
            return Number.isSafeInteger(n) ? n : v.toString();
          }
          return v;
        })
      );

const withId = (row) => row && ({
  ...row,
  _id: row.id
});

const roleFor = async (id) =>
  id ? prisma.roles.findUnique({ where: { id } }) : null;

const departmentFor = async (id) =>
  id ? prisma.departments.findUnique({ where: { id } }) : null;

const withUserRelations = async (row) => {
  if (!row) return null;

  const [role, department] = await Promise.all([
    roleFor(row.role_id),
    departmentFor(row.department_id)
  ]);

  return {
    ...withId(row),
    role: withId(role),
    department: withId(department)
  };
};

const safeUser = (row) => {
  if (!row) return null;

  const {
    password,
    refreshToken,
    resetPasswordToken,
    resetPasswordExpire,
    otp,
    otpExpiry,
    ...safe
  } = row;

  return safe;
};

const employeeWithRole = async (row) =>
  row
    ? {
        ...withId(row),
        role: withId(await roleFor(row.role_id))
      }
    : null;

const getEmployeeData = async (master) => {
  const table =
    master.sourceModel === 'EmployeeNew'
      ? 'employeenews'
      : master.sourceModel === 'EmployeeDetail'
        ? 'employeedetails'
        : null;

  if (!table || !master.employeeRefId) return null;

  const row = await prisma[table].findUnique({
    where: { id: master.employeeRefId }
  });

  if (!row) return null;

  const category = row.category_id
    ? await prisma.categories.findUnique({
        where: { id: row.category_id }
      })
    : null;

  return {
    ...withId(row),
    role: withId(await roleFor(row.role_id)),
    category: withId(category)
  };
};


// =====================================================
// GET USER DETAILS
// =====================================================

export const getUserDetails = async (req, res) => {
  try {
    if (req.isEmployee) {
      const master = await prisma.masteremployees.findUnique({
        where: { id: userId(req.user) }
      });

      if (!master) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      const user = await getEmployeeData(master);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Employee data not found'
        });
      }

      return res.status(200).json({
        success: true,
        // safeUser removes password/token fields, jsonSafe fixes BigInt
        user: jsonSafe(safeUser(user)),
        type: 'employee'
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId(req.user) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: jsonSafe(safeUser(await withUserRelations(user))),
      type: 'user'
    });

  } catch (err) {
    console.error('GetMe Error:', err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// =====================================================
// REFRESH TOKEN
// =====================================================

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token found'
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    });

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'User inactive'
        });
      }

      return sendToken(
        jsonSafe(await withUserRelations(user)),
        200,
        res
      );
    }

    const emp = await prisma.masteremployees.findUnique({
      where: { id: decoded.id }
    });

    if (!emp) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!emp.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User inactive'
      });
    }

    return empToken(
      jsonSafe({
        ...withId(emp),
        role: withId(await roleFor(emp.role_id))
      }),
      200,
      res
    );

  } catch (err) {
    console.error('Refresh Token Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// =====================================================
// UPDATE PASSWORD
// =====================================================

export const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        newPassword
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain uppercase, lowercase, number & special character'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const id = userId(req.user);

    const table = req.isEmployee
      ? 'masteremployees'
      : 'users';

    await prisma[table].update({
      where: { id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update Password Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// =====================================================
// REGISTER USER
// =====================================================

// Original registration uses a legacy schema that does
// not match the current MySQL users table.
// Registration remains disabled until reconciliation.
// The registration route is currently not mounted.

export const registerUser = async (req, res) => {
  return res.status(500).json({
    success: false,
    message:
      'Registration schema requires reconciliation before enabling this endpoint'
  });
};


// =====================================================
// VERIFY EMAIL OTP
// =====================================================

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    // Validate required fields
    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof otp !== 'string' && typeof otp !== 'number' ||
      !String(otp).trim()
    ) {
      return res.status(400).json({
        message: 'Email and OTP are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = String(otp).trim();

    const user = await prisma.users.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: 'Email already verified'
      });
    }

    if (
      !user.otpExpiry ||
      user.otpExpiry.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: 'OTP expired'
      });
    }

    if (
      !user.otp ||
      !(await bcrypt.compare(normalizedOtp, user.otp))
    ) {
      return res.status(400).json({
        message: 'Invalid OTP'
      });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null
      }
    });

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '15m'
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d'
      }
    );

    await prisma.users.update({
      where: { id: user.id },
      data: {
        refreshToken: crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex')
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error('Verify email error:', err);

    return res.status(500).json({
      message: 'Server error'
    });
  }
};


// =====================================================
// RESEND EMAIL OTP
// =====================================================

export const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (
      typeof email !== 'string' ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.users.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    const rawOtp = crypto
      .randomInt(100000, 1000000)
      .toString();

    await prisma.users.update({
      where: { id: user.id },
      data: {
        otp: await bcrypt.hash(rawOtp, 12),
        otpExpiry: new Date(Date.now() + 600000)
      }
    });

    await sendEmail({
      to: normalizedEmail,
      subject: 'Resend Email Verification OTP',
      text:
        `Hello ${user.firstName || user.username},\n\n` +
        `Your new OTP is ${rawOtp}. ` +
        `It expires in 10 minutes.\n\nThank you!`
    });

    return res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });

  } catch (err) {
    console.error('Resend OTP error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Phone Number and Password required'
      });
    }

    identifier = identifier.trim();

    const isEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await prisma.users.findFirst({
      where: isEmail
        ? { email: identifier.toLowerCase() }
        : { phoneNumber: identifier }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail
          ? 'Invalid Email'
          : 'Invalid Phone Number'
      });
    }

    if (
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account inactive'
      });
    }

    return sendToken(
      jsonSafe(await withUserRelations(user)),
      200,
      res
    );

  } catch (err) {
    console.error('Login Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// =====================================================
// LOGOUT
// =====================================================

export const logout = async (req, res) => {
  try {
    const isProd =
      process.env.NODE_ENV === 'production';

    const token = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await prisma.users.findUnique({
          where: { id: decoded.id }
        });

        if (user) {
          await prisma.users.update({
            where: { id: user.id },
            data: { refreshToken: null }
          });
        }

      } catch {
        // Logout even if the token is invalid.
      }
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};


// =====================================================
// UPDATE USER PROFILE
// =====================================================

export const updateUserProfile = async (req, res) => {
  try {
    const id = userId(req.user);

    const user = await prisma.users.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const getString = (value) =>
      !value
        ? ''
        : String(
            Array.isArray(value)
              ? value[0] || ''
              : value
          ).trim();

    const username = getString(req.body.username);
    const firstName = getString(req.body.firstName);
    const lastName = getString(req.body.lastName);
    const phoneNumber = getString(req.body.phoneNumber);
    const email = getString(req.body.email).toLowerCase();
    const empCode = getString(req.body.empCode);

    const data = {};

    if (req.file) {
      data.profilePic = `/uploads/${req.file.filename}`;
    }

    for (
      const [field, value, label] of [
        ['email', email, 'Email'],
        ['empCode', empCode, 'Employee code'],
        ['phoneNumber', phoneNumber, 'Mobile number']
      ]
    ) {
      if (
        !value ||
        (
          field === 'phoneNumber'
            ? false
            : value === user[field]
        )
      ) {
        continue;
      }

      if (
        field === 'phoneNumber' &&
        !/^[6-9]\d{9}$/.test(value)
      ) {
        return res.status(400).json({
          success: false,
          field,
          message: 'Invalid mobile number'
        });
      }

      const duplicate = await prisma.users.findFirst({
        where: {
          [field]: value,
          id: { not: id }
        }
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          field,
          message: `${label} already exists`
        });
      }

      data[field] = value;
    }

    if (username) data.username = username;
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;

    data.updatedAt = new Date();

    const updated = await prisma.users.update({
      where: { id },
      data
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: jsonSafe(
        safeUser(
          await withUserRelations(updated)
        )
      )
    });

  } catch (err) {
    console.error('Update Profile Error:', err);

    if (err.code === 'P2002') {
      const field = Array.isArray(err.meta?.target)
        ? err.meta.target[0]
        : 'field';

      return res.status(400).json({
        success: false,
        field,
        message: `${field} already exists`
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: 'Email required'
      });
    }

    if (!token) {
      return res.status(400).json({
        message: 'Captcha token missing'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const captchaRes = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    if (!captchaRes.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Captcha verification failed ❌'
      });
    }

    const user = await prisma.users.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If this email exists, a reset link has been sent 📧'
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString('hex');

    await prisma.users.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpire: new Date(
          Date.now() + 30 * 60 * 1000
        )
      }
    });

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html =
      `<p>Hello ${user.firstName || user.username},</p>` +
      `<p>You requested to reset your password.</p>` +
      `<p><a href="${resetLink}">Click here to reset your password</a></p>` +
      `<p>This link will expire in 30 minutes.</p>` +
      `<p>If you did not request this, please ignore this email.</p>`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html
    });

    return res.status(200).json({
      success: true,
      message: 'Reset password email sent ✅'
    });

  } catch (err) {
    console.error('Forgot Password Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token and new password required'
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired token'
      });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        resetPasswordToken: null,
        resetPasswordExpire: null,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      message: 'Password reset successful'
    });

  } catch (err) {
    console.error('Reset Password Error:', err);

    return res.status(500).json({
      message: 'Server Error'
    });
  }
};