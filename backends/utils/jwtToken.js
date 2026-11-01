import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database.js';

const sendToken = async (user, statusCode, res) => {
  try {
    const id = user._id || user.id;
    const roleId = user.role_id || (typeof user.role === 'string' ? user.role : user.role?.id || user.role?._id);
    const accessToken = jwt.sign({ id, role: roleId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' });
    await prisma.users.update({ where: { id }, data: { refreshToken: crypto.createHash('sha256').update(refreshToken).digest('hex') } });
    const isSecure = process.env.NODE_ENV === 'production';
    const cookieOptions = (expiresIn) => ({ expires: new Date(Date.now() + expiresIn), httpOnly: true, secure: isSecure, sameSite: isSecure ? 'None' : 'Lax', path: '/' });
    return res.status(statusCode)
      .cookie('accessToken', accessToken, cookieOptions(15 * 30 * 1000))
      .cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000))
      .json({ success: true, message: 'Login successful', user: { role: { role_key: user?.role?.role_key } } });
  } catch (err) {
    console.error('sendToken error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export default sendToken;
