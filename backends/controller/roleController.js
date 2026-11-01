import { randomBytes } from "node:crypto";
import { prisma } from "../config/database.js";

const db = prisma.roles;
const newId = () => randomBytes(12).toString("hex");
const validId = (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
const withMongoId = (record) => record ? { ...record, _id: record.id } : record;
const sameName = (a, b) => String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
const generateKey = (name) => name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");

const errorResponse = (res, error) => {
  console.error("Role Controller Error:", error);
  if (error.code === "P2002") return res.status(409).json({ success: false, message: "Role already exists" });
  if (error.code === "P2003") return res.status(409).json({ success: false, message: "Role is referenced by other records" });
  if (error.code === "P2025") return res.status(404).json({ success: false, message: "Role not found" });
  return res.status(500).json({ success: false, message: "Internal server error" });
};

export const createRole = async (req, res) => {
  try {
    const body = req.body || {};
    if (Object.prototype.hasOwnProperty.call(body, "role_key")) {
      return res.status(400).json({ success: false, message: "role_key cannot be set manually" });
    }
    if (typeof body.role_name !== "string" || !body.role_name.trim()) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }
    const role_name = body.role_name.trim();
    const role_key = generateKey(role_name);
    const rows = await db.findMany({ select: { role_name: true, role_key: true } });
    if (rows.some((row) => sameName(row.role_name, role_name) || row.role_key === role_key)) {
      return res.status(400).json({ success: false, message: "Role already exists" });
    }
    const role = await db.create({
      data: { id: newId(), role_name, role_key, createdAt: new Date(), updatedAt: new Date() },
    });
    return res.status(201).json({ success: true, message: "Role created successfully", role: withMongoId(role) });
  } catch (error) { return errorResponse(res, error); }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Role ID" });
    const body = req.body || {};
    if (Object.prototype.hasOwnProperty.call(body, "role_key")) {
      return res.status(400).json({ success: false, message: "role_key cannot be updated" });
    }
    const old = await db.findUnique({ where: { id } });
    if (!old) return res.status(404).json({ success: false, message: "Role not found" });
    if (typeof body.role_name !== "string" || !body.role_name.trim()) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }
    const role_name = body.role_name.trim();
    if (sameName(old.role_name, role_name)) {
      return res.status(400).json({ success: false, message: "New role name must be different" });
    }
    const rows = await db.findMany({ where: { id: { not: id } }, select: { role_name: true } });
    if (rows.some((row) => sameName(row.role_name, role_name))) {
      return res.status(400).json({ success: false, message: "Role already exists" });
    }
    // Keep role_key stable because authorization rules may depend on it.
    const role = await db.update({ where: { id }, data: { role_name, updatedAt: new Date() } });
    return res.status(200).json({ success: true, message: "Role updated successfully", role: withMongoId(role) });
  } catch (error) { return errorResponse(res, error); }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await db.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ success: true, count: roles.length, roles: roles.map(withMongoId) });
  } catch (error) { return errorResponse(res, error); }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Role ID" });
    const role = await db.findUnique({ where: { id } });
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    return res.status(200).json({ success: true, role: withMongoId(role) });
  } catch (error) { return errorResponse(res, error); }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Role ID" });
    const role = await db.findUnique({ where: { id } });
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    if (role.role_key === "admin") {
      return res.status(403).json({ success: false, message: "Admin role cannot be deleted" });
    }
    await db.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) { return errorResponse(res, error); }
};
