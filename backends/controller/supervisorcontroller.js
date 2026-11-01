import crypto from "node:crypto";
import { prisma } from "../config/database.js";

const validId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));
const parseValue = (value) => {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
};
const asText = (value) => value == null ? null : typeof value === "string" ? value : JSON.stringify(value);
const fromText = (value) => {
  if (value == null) return value;
  try { return JSON.parse(value); } catch { return value; }
};
const signatureFromFile = (file) => file ? {
  url: `/uploads/${file.filename}`, public_id: file.filename,
  originalName: file.originalname, mimeType: file.mimetype, size: file.size,
} : null;
const signatureFields = (file) => file ? {
  officerSignature_url: `/uploads/${file.filename}`,
  officerSignature_publicId: file.filename,
  officerSignature_originalName: file.originalname,
  officerSignature_mimeType: file.mimetype,
  officerSignature_size: BigInt(file.size),
} : {};
const normalizedDate = (value) => value ? new Date(value) : null;

export const getSupervisorFields = (body) => ({
  tasks: body.tasks, achievements: body.achievements,
  name: body.name, designation: body.designation,
  shortfalls: body.shortfalls, higherAchievements: body.higherAchievements,
  place: body.place, date: body.date, financialYear: body.financialYear,
  status: body.status || "draft", department: body.department || null,
  reportingOfficerId: body.reportingOfficerId,
});

// Prisma's MySQL schema stores signature metadata in separate columns and
// appraisal task objects as LONGTEXT. Restore the previous API JSON shape.
const present = (row) => {
  if (!row) return row;
  const {
    officerSignature_url, officerSignature_publicId,
    officerSignature_originalName, officerSignature_mimeType,
    officerSignature_size, department_id, category_id, ...rest
  } = row;
  return {
    ...rest, _id: row.id,
    tasks: fromText(row.tasks), achievements: fromText(row.achievements),
    higherAchievements: fromText(row.higherAchievements), shortfalls: fromText(row.shortfalls),
    department: department_id ?? null, category: category_id ?? null,
    officerSignature: officerSignature_url ? {
      url: officerSignature_url, public_id: officerSignature_publicId,
      originalName: officerSignature_originalName,
      mimeType: officerSignature_mimeType,
      size: officerSignature_size == null ? null : Number(officerSignature_size),
    } : null,
  };
};
const referenceData = async (rows, { employee = false, category = false, department = false, officer = false } = {}) => {
  const values = rows.map(present);
  const unique = (key) => [...new Set(rows.map((r) => r[key]).filter(Boolean))];
  const [categories, departments, users, employees] = await Promise.all([
    category ? prisma.categories.findMany({ where: { id: { in: unique("category_id") } } }) : [],
    department ? prisma.departments.findMany({ where: { id: { in: unique("department_id") } } }) : [],
    officer ? prisma.users.findMany({ where: { id: { in: unique("reportingOfficerId") } }, select: { id: true, firstName: true, lastName: true } }) : [],
    employee ? prisma.masteremployees.findMany({ where: { employeeRefId: { in: unique("employeeId") } } }) : [],
  ]);
  const byId = (items) => new Map(items.map((x) => [x.id, { ...x, _id: x.id }]));
  const c = byId(categories), d = byId(departments), u = byId(users);
  const e = new Map(employees.map((x) => [x.employeeRefId, { ...x, _id: x.id }]));
  return values.map((x, i) => ({
    ...x,
    ...(category ? { category: c.get(rows[i].category_id) || null } : {}),
    ...(department ? { department: d.get(rows[i].department_id) || null } : {}),
    ...(officer ? { reportingOfficerId: u.get(rows[i].reportingOfficerId) || null } : {}),
    ...(employee ? { employeeId: e.get(rows[i].employeeId) || null } : {}),
  }));
};
const inputData = (body) => {
  const p = getSupervisorFields(body);
  const data = {};
  for (const key of ["tasks", "achievements", "shortfalls", "higherAchievements"]) {
    if (p[key] !== undefined) data[key] = asText(p[key]);
  }
  for (const key of ["name", "designation", "place", "financialYear", "reportingOfficerId"]) {
    if (p[key] !== undefined) data[key] = p[key];
  }
  if (p.date !== undefined) data.date = normalizedDate(p.date);
  if (p.department !== undefined) data.department_id = p.department;
  // The current MySQL supervisors table has no status column.
  return data;
};
const serverError = (res, err, message = null) => res.status(500).json({ success: false, message: message || err.message });

export const createSupervisor = async (req, res) => {
  try {
    const employee = await prisma.masteremployees.findFirst({ where: { employeeRefId: String(req.employeeRefId || "") } });
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    const body = Object.fromEntries(Object.entries(req.body || {}).map(([k, v]) => [k, parseValue(v)]));
    const existing = await prisma.supervisors.findFirst({ where: {
      employeeId: employee.employeeRefId, reportingOfficerId: body.reportingOfficerId,
      financialYear: body.financialYear,
    } });
    if (existing) return res.status(400).json({ success: false, message: "Supervisor appraisal already exists for this reporting officer and financial year" });
    const file = req.files?.officerSignature?.[0];
    const row = await prisma.supervisors.create({ data: {
      id: crypto.randomBytes(12).toString("hex"),
      ...inputData(body), employeeId: employee.employeeRefId,
      category_id: employee.category_id,
      ...signatureFields(file), createdAt: new Date(), updatedAt: new Date(),
    } });
    return res.status(201).json({ success: true, message: "Supervisor appraisal created successfully", data: present(row) });
  } catch (err) { console.error("CREATE_SUPERVISOR_ERROR:", err); return serverError(res, err); }
};

export const viewEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!validId(employeeId)) return res.status(400).json({ success: false, message: "Invalid Employee ID" });
    const row = await prisma.supervisors.findFirst({ where: { employeeId, reportingOfficerId: String(req.user?._id || req.user?.id || "") }, orderBy: { createdAt: "desc" } });
    if (!row) return res.status(404).json({ success: false, message: "No appraisal found OR you are not the reporting officer for this employee" });
    const [data] = await referenceData([row], { category: true, department: true, officer: true });
    return res.status(200).json({ success: true, data: { ...data, department: data.department ? { department_name: data.department.department_name } : null, reportingOfficerId: data.reportingOfficerId ? { firstName: data.reportingOfficerId.firstName } : null } });
  } catch (err) { return res.status(500).json({ success: false, message: "Server Error", error: err.message }); }
};

export const viewEmployeeDetail = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!validId(employeeId)) return res.status(400).json({ success: false, message: "Invalid Employee ID" });
    const rows = await prisma.supervisors.findMany({ where: { employeeId }, orderBy: { createdAt: "desc" } });
    if (!rows.length) return res.status(404).json({ success: false, message: "No appraisal records found" });
    const populated = await referenceData(rows, { category: true, department: true, officer: true });
    const data = populated.map((x) => ({ ...x, department: x.department?.department_name || "", reportingOfficer: x.reportingOfficerId?.firstName || "", reportingOfficerId: x.reportingOfficerId ? { firstName: x.reportingOfficerId.firstName } : null }));
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { return res.status(500).json({ success: false, message: "Server Error", error: err.message }); }
};

export const updateSupervisor = async (req, res) => {
  try {
    const employee = await prisma.masteremployees.findFirst({ where: { employeeRefId: String(req.employeeRefId || "") } });
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    const existing = await prisma.supervisors.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: "Supervisor appraisal not found" });
    const data = inputData(req.body || {});
    delete data.department_id;
    delete data.reportingOfficerId;
    const row = await prisma.supervisors.update({ where: { id: req.params.id }, data: { ...data, updatedAt: new Date() } });
    return res.status(200).json({ success: true, message: "Supervisor appraisal updated successfully", data: present(row) });
  } catch (err) { return serverError(res, err); }
};

export const getSupervisorById = async (req, res) => {
  try {
    const row = await prisma.supervisors.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ success: false, message: "Supervisor appraisal not found" });
    const [data] = await referenceData([row], { employee: true, officer: true });
    return res.status(200).json({ success: true, data });
  } catch (err) { return serverError(res, err); }
};

export const getAllSupervisors = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;
    if (!employeeId) return res.status(401).json({ success: false, message: "Employee not found" });
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const where = { employeeId: String(employeeId) };
    const [totalSupervisors, rows] = await Promise.all([
      prisma.supervisors.count({ where }),
      prisma.supervisors.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    ]);
    const data = await referenceData(rows, { category: true, department: true, officer: true });
    return res.status(200).json({ success: true, count: data.length, totalSupervisors, currentPage: page, totalPages: Math.ceil(totalSupervisors / limit), limit, data: data.map((x) => ({ ...x, category: x.category ? { _id: x.category.id, name: x.category.name, category_key: x.category.category_key } : null, department: x.department ? { department_name: x.department.department_name } : null, reportingOfficerId: x.reportingOfficerId ? { firstName: x.reportingOfficerId.firstName } : null })) });
  } catch (err) { return serverError(res, err); }
};

export const deleteSupervisor = async (req, res) => {
  try {
    const row = await prisma.supervisors.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ success: false, message: "Supervisor appraisal not found" });
    await prisma.supervisors.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: "Supervisor appraisal deleted successfully" });
  } catch (err) { return serverError(res, err); }
};

export const viewapprisalDetails = async (req, res) => {
  try {
    const { appraisalId } = req.params;
    if (!validId(appraisalId)) return res.status(400).json({ success: false, message: "Invalid Appraisal ID" });
    const row = await prisma.supervisors.findUnique({ where: { id: appraisalId } });
    if (!row) return res.status(404).json({ success: false, message: "No Supervisor Appraisal found" });
    const [data] = await referenceData([row], { employee: true, officer: true, department: true, category: true });
    return res.status(200).json({ success: true, data: { ...data, department: data.department ? { department_name: data.department.department_name } : null } });
  } catch (err) { return res.status(500).json({ success: false, message: "Server Error", error: err.message }); }
};
