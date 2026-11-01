
import bcrypt from "bcryptjs";
import crypto from "crypto";

import AppError from "../utils/AppError.js";
import { prisma } from "../config/database.js";

// =====================================================
// COMMON HELPERS
// =====================================================

const getString = (value) => {
  if (value === undefined || value === null) return "";

  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value).trim();
};

const withId = (row) => {
  if (!row) return null;

  return {
    ...row,
    _id: row.id
  };
};

const getRole = async (id) => {
  if (!id) return null;

  return prisma.roles.findUnique({
    where: { id }
  });
};

const getDepartment = async (id) => {
  if (!id) return null;

  return prisma.departments.findUnique({
    where: { id }
  });
};

const formatUser = async (row) => {
  if (!row) return null;

  const [role, department] = await Promise.all([
    getRole(row.role_id),
    getDepartment(row.department_id)
  ]);

  const {
    password,
    refreshToken,
    resetPasswordToken,
    resetPasswordExpire,
    otp,
    otpExpiry,
    ...safe
  } = row;

  return {
    ...withId(safe),

    // Preserve MongoDB-style populated fields
    role: role ? withId(role) : null,
    department: department ? withId(department) : null
  };
};

const formatUsers = async (rows) => {
  return Promise.all(rows.map(formatUser));
};

const getAdminRole = async () => {
  return prisma.roles.findFirst({
    where: {
      role_key: "admin"
    }
  });
};

const nonAdminFilter = async () => {
  const adminRole = await getAdminRole();

  if (!adminRole) return {};

  return {
    OR: [
      { role_id: { not: adminRole.id } },
      { role_id: null }
    ]
  };
};

const handleError = (res, err, title) => {
  console.error(title, err);

  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
};

// =====================================================
// 1. REGISTER USER
// =====================================================

export const registerUser = async (req, res, next) => {
  try {
    const empCode = getString(req.body.empCode);
    const username = getString(req.body.username);
    const firstName = getString(req.body.firstName);
    const lastName = getString(req.body.lastName);
    const email = getString(req.body.email).toLowerCase();
    const password = getString(req.body.password);
    const confirmPassword = getString(req.body.confirmPassword);
    const phoneNumber = getString(req.body.phoneNumber);
    const roleId = getString(req.body.role);
    const departmentId = getString(req.body.department);

    if (
      !empCode ||
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !roleId ||
      !departmentId
    ) {
      throw new AppError(
        "All required fields are missing",
        400
      );
    }

    if (password !== confirmPassword) {
      throw new AppError(
        "Passwords do not match",
        400
      );
    }

    const existingEmpCode = await prisma.users.findFirst({
      where: { empCode }
    });

    if (existingEmpCode) {
      throw new AppError(
        "Employee code already exists",
        400
      );
    }

    const existingEmail = await prisma.users.findFirst({
      where: { email }
    });

    if (existingEmail) {
      throw new AppError(
        "User already exists",
        400
      );
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      throw new AppError(
        "Invalid mobile number",
        400
      );
    }

    const existingPhone = await prisma.users.findFirst({
      where: { phoneNumber }
    });

    if (existingPhone) {
      throw new AppError(
        "Mobile already exists",
        400
      );
    }

    const existingUsername = await prisma.users.findFirst({
      where: { username }
    });

    if (existingUsername) {
      throw new AppError(
        "Username already exists",
        400
      );
    }

    const role = await getRole(roleId);

    if (!role) {
      throw new AppError(
        "Invalid role selected",
        400
      );
    }

    const department = await getDepartment(departmentId);

    if (!department) {
      throw new AppError(
        "Invalid department selected",
        400
      );
    }

    if (
      role.role_key === "admin" &&
      email !== process.env.ADMIN_EMAIL
    ) {
      throw new AppError(
        "Not allowed to register as Admin",
        403
      );
    }

    const profilePicPath = req.file
      ? `/uploads/${req.file.filename}`
      : "https://via.placeholder.com/150";

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        id: crypto.randomBytes(12).toString("hex"),
        empCode,
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        profilePic: profilePicPath,
        role_id: role.id,
        department_id: department.id,
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const formattedUser = await formatUser(user);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user.id,
      user: formattedUser
    });

  } catch (err) {
    return next(err);
  }
};

// =====================================================
// 2. GET ALL USERS
// =====================================================

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const skip = (page - 1) * limit;

    // Exclude admin users as in original controller
    const where = await nonAdminFilter();

    const [users, totalUsers] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),

      prisma.users.count({
        where
      })
    ]);

    const formattedUsers = await formatUsers(users);

    return res.status(200).json({
      success: true,
      users: formattedUsers,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit)
    });

  } catch (err) {
    return handleError(res, err, "Get Users Error:");
  }
};

// =====================================================
// 3. UPDATE USER
// =====================================================

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId, departmentId } = req.body;

    const user = await prisma.users.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currentRole = await getRole(user.role_id);

    if (currentRole?.role_key === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin role cannot be changed"
      });
    }

    const updateData = {};

    if (roleId) {
      const role = await getRole(roleId);

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected"
        });
      }

      if (
        role.role_key === "admin" &&
        user.email?.toLowerCase() !== process.env.ADMIN_EMAIL
      ) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to assign Admin role"
        });
      }

      updateData.role_id = roleId;
    }

    if (departmentId) {
      const department = await getDepartment(departmentId);

      if (!department) {
        return res.status(400).json({
          success: false,
          message: "Invalid department selected"
        });
      }

      updateData.department_id = departmentId;
    }

    updateData.updatedAt = new Date();

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData
    });

    return res.json({
      success: true,
      message: "User updated successfully",
      user: await formatUser(updatedUser)
    });

  } catch (err) {
    return handleError(res, err, "Update User Error:");
  }
};

// =====================================================
// 4. GET SINGLE USER
// =====================================================

export const getSingleUser = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: await formatUser(user)
    });

  } catch (err) {
    console.error("Get Single User Error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
};

// =====================================================
// 5. DELETE USER
// =====================================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const role = await getRole(user.role_id);

    if (role?.role_key === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin cannot be deleted"
      });
    }

    await prisma.users.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {
    return handleError(res, err, "Delete User Error:");
  }
};

// =====================================================
// 6. SEARCH USERS
// =====================================================

export const searchUsers = async (req, res) => {
  try {
    const query = getString(req.query.query);

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    const orFilters = [
      { id: { contains: query } },
      { firstName: { contains: query } },
      { lastName: { contains: query } },
      { username: { contains: query } },
      { email: { contains: query } },
      { phoneNumber: { contains: query } },
      { empCode: { contains: query } }
    ];

    // Date search: dd/mm/yyyy
    const dateMatch = query.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (dateMatch) {
      const day = Number(dateMatch[1]);
      const month = Number(dateMatch[2]) - 1;
      const year = Number(dateMatch[3]);

      const start = new Date(
        Date.UTC(year, month, day)
      );

      if (
        start.getUTCFullYear() === year &&
        start.getUTCMonth() === month &&
        start.getUTCDate() === day
      ) {
        const end = new Date(
          start.getTime() + 24 * 60 * 60 * 1000
        );

        orFilters.push({
          createdAt: {
            gte: start,
            lt: end
          }
        });
      }
    }

    const users = await prisma.users.findMany({
      where: {
        AND: [
          await nonAdminFilter(),
          { OR: orFilters }
        ]
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      users: await formatUsers(users),
      totalUsers: users.length
    });

  } catch (err) {
    console.error("Search Users Error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
};

// =====================================================
// 7. DASHBOARD STATS
// =====================================================

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.users.count();

    return res.status(200).json({
      success: true,
      data: {
        totalUsers
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
