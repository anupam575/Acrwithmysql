import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || (authHeader && authHeader.split(' ')[1]);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication token missing' });
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
    catch { return res.status(401).json({ success: false, message: 'Invalid or expired token' }); }
    let user;
    const isEmployee = decoded.type === 'employee';
    if (isEmployee) {
      if (!decoded.employeeRefId) return res.status(401).json({ success: false, message: 'Employee reference ID missing in token' });
      user = await prisma.masteremployees.findFirst({ where: { employeeRefId: decoded.employeeRefId } });
      if (!user) return res.status(401).json({ success: false, message: 'Employee not found' });
    } else {
      user = await prisma.users.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    }

    // FIX: NULL isActive ko deactivated nahi maanna, sirf explicit false block hoga
    if (user.isActive === false) return res.status(403).json({ success: false, message: 'Account is deactivated' });

    const role = user.role_id ? await prisma.roles.findUnique({ where: { id: user.role_id } }) : null;
    req.user = { ...user, _id: user.id, role: role ? { ...role, _id: role.id } : null };
    req.employeeRefId = decoded.employeeRefId || null;
    req.isEmployee = isEmployee;
    return next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({ success: false, message: 'Server error in authentication' });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'User not authenticated' });
    const roleKey = req.user.role?.role_key;
    if (!roleKey) return res.status(403).json({ success: false, message: 'User role not found' });
    if (!allowedRoles.map(r => r.toLowerCase()).includes(roleKey.toLowerCase())) return res.status(403).json({ success: false, message: 'Access denied' });
    return next();
  } catch {
    return res.status(500).json({ success: false, message: 'Server error in role authorization' });
  }
};
