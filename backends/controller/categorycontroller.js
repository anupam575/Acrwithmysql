import { randomBytes } from "node:crypto";
import { prisma } from "../config/database.js";

const db = prisma.categories;
const newId = () => randomBytes(12).toString("hex");
const validId = (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
const withMongoId = (record) => record ? { ...record, _id: record.id } : record;
const sameName = (a, b) => String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
const generateKey = (name) => name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");

const errorResponse = (res, error) => {
  console.error("Category Controller Error:", error);
  if (error.code === "P2002") return res.status(409).json({ success: false, message: "Category already exists" });
  if (error.code === "P2003") return res.status(409).json({ success: false, message: "Category is referenced by other records" });
  if (error.code === "P2025") return res.status(404).json({ success: false, message: "Category not found" });
  return res.status(500).json({ success: false, message: "Internal server error" });
};

export const createCategory = async (req, res) => {
  try {
    const { name: rawName } = req.body || {};
    if (typeof rawName !== "string" || !rawName.trim()) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const name = rawName.trim();
    const category_key = generateKey(name);
    const rows = await db.findMany({ select: { name: true, category_key: true } });
    if (rows.some((row) => sameName(row.name, name) || row.category_key === category_key)) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }
    const category = await db.create({
      data: { id: newId(), name, category_key, createdAt: new Date(), updatedAt: new Date() },
    });
    return res.status(201).json({ success: true, message: "Category created successfully", category: withMongoId(category) });
  } catch (error) { return errorResponse(res, error); }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Category ID" });
    const old = await db.findUnique({ where: { id } });
    if (!old) return res.status(404).json({ success: false, message: "Category not found" });
    const { name: rawName } = req.body || {};
    if (typeof rawName !== "string" || !rawName.trim()) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const name = rawName.trim();
    if (sameName(old.name, name)) {
      return res.status(400).json({ success: false, message: "New category name must be different" });
    }
    const category_key = generateKey(name);
    const rows = await db.findMany({ where: { id: { not: id } }, select: { name: true, category_key: true } });
    if (rows.some((row) => sameName(row.name, name) || row.category_key === category_key)) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }
    // Keep category_key stable on rename to avoid breaking existing references.
    const category = await db.update({ where: { id }, data: { name, updatedAt: new Date() } });
    return res.status(200).json({ success: true, message: "Category updated successfully", category: withMongoId(category) });
  } catch (error) { return errorResponse(res, error); }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await db.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ success: true, count: categories.length, categories: categories.map(withMongoId) });
  } catch (error) { return errorResponse(res, error); }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Category ID" });
    const category = await db.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, category: withMongoId(category) });
  } catch (error) { return errorResponse(res, error); }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ success: false, message: "Invalid Category ID" });
    const category = await db.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    await db.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) { return errorResponse(res, error); }
};
