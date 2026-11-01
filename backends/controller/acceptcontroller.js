import { randomBytes } from 'node:crypto';
import { prisma } from '../config/database.js';

const newId = () => randomBytes(12).toString('hex');
const fileInfo = file => file ? { url: `/uploads/${file.filename}`, public_id: file.filename, originalName: file.originalname, mimeType: file.mimetype, size: file.size } : null;
const fileColumns = file => ({ officerSignature_url: file?.url ?? null, officerSignature_public_id: file?.public_id ?? null, officerSignature_originalName: file?.originalName ?? null, officerSignature_mimeType: file?.mimeType ?? null, officerSignature_size: file?.size != null ? BigInt(file.size) : null });
const serialize = value => JSON.parse(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? Number(v) : v));
const format = row => {
  if (!row) return row;
  const { id, agreedWithRemarks, officerSignature_url, officerSignature_public_id, officerSignature_originalName, officerSignature_mimeType, officerSignature_size, ...rest } = row;
  const officerSignature = officerSignature_url ? { url: officerSignature_url, public_id: officerSignature_public_id, originalName: officerSignature_originalName, mimeType: officerSignature_mimeType, size: officerSignature_size == null ? null : Number(officerSignature_size) } : null;
  return serialize({ _id: id, ...rest, ...(Object.hasOwn(row, 'agreedWithRemarks') ? { agreeWithRemarks: agreedWithRemarks } : {}), officerSignature });
};
const currentFY = () => { const d = new Date(); const y = d.getFullYear(); return d.getMonth() >= 3 ? `${y}-${y+1}` : `${y-1}-${y}`; };
const validId = id => /^[a-f\d]{24}$/i.test(String(id ?? ''));

export const createAcceptanceSection = async (req, res) => {
  try {
    const { overallGradeConsistent, agreeWithRemarks, differenceOpinion = '', overallGrade, acceptingAuthorityNameDesignation, currentFinancialYear, employeeId } = req.body;
    const reviewingOfficerId = req.user?._id;
    const officerSignature = fileInfo(req.files?.officerSignature?.[0]);
    const financialYear = currentFinancialYear || currentFY();
    if (!employeeId || !reviewingOfficerId || !financialYear || !overallGradeConsistent || !agreeWithRemarks || overallGrade === undefined || overallGrade === null || !acceptingAuthorityNameDesignation || !officerSignature) return res.status(400).json({ success: false, message: 'Missing required fields' });
    const existing = await prisma.acceptancesections.findFirst({ where: { employeeId: String(employeeId), reviewingOfficerId: String(reviewingOfficerId), currentFinancialYear: financialYear } });
    if (existing) return res.status(409).json({ success: false, message: 'Acceptance Section already exists for this employee and financial year' });
    const data = await prisma.acceptancesections.create({ data: { id: newId(), employeeId: String(employeeId), reviewingOfficerId: String(reviewingOfficerId), currentFinancialYear: financialYear, overallGradeConsistent: String(overallGradeConsistent), agreedWithRemarks: String(agreeWithRemarks), differenceOpinion: String(differenceOpinion), overallGrade: Number(overallGrade), acceptingAuthorityNameDesignation: String(acceptingAuthorityNameDesignation), ...fileColumns(officerSignature), createdAt: new Date(), updatedAt: new Date() } });
    return res.status(201).json({ success: true, message: 'Acceptance section saved successfully', data: format(data) });
  } catch (error) { console.error('Acceptance Section Error:', error); return res.status(500).json({ success: false, message: error.message }); }
};

export const getEmployeeAcceptanceData = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;
    if (!employeeId) return res.status(400).json({ success: false, message: 'Employee ID not found in token' });
    const data = await prisma.acceptancesections.findMany({ where: { employeeId: String(employeeId) }, orderBy: { createdAt: 'desc' } });
    if (!data.length) return res.status(404).json({ success: false, message: 'No acceptance data found for this employee' });
    return res.status(200).json({ success: true, count: data.length, data: data.map(format) });
  } catch (error) { console.error('Acceptance API Error:', error); return res.status(500).json({ success: false, message: 'Server Error' }); }
};

export const getEmployeeAcceptanceid = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) return res.status(400).json({ success: false, message: 'Employee ID is required' });
    if (!validId(employeeId)) return res.status(400).json({ success: false, message: 'Invalid Employee ID' });
    const data = await prisma.acceptancesections.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' } });
    if (!data.length) return res.status(404).json({ success: false, message: 'No acceptance data found for this employee' });
    return res.status(200).json({ success: true, count: data.length, data: data.map(format) });
  } catch (error) { console.error('Acceptance API Error:', error); return res.status(500).json({ success: false, message: 'Server Error', error: error.message }); }
};

export const createAcceptingAuthority = async (req, res) => {
  try {
    const acceptingAuthorityId = req.user?._id;
    const currentFinancialYear = currentFY();
    if (!req.body.employeeId) return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    const existing = await prisma.acceptingauthorities.findFirst({ where: { employeeId: String(req.body.employeeId), acceptingAuthorityId: acceptingAuthorityId == null ? null : String(acceptingAuthorityId), currentFinancialYear } });
    if (existing) return res.status(409).json({ success: false, message: 'Accepting Authority record already exists for this employee and financial year.' });
    const score = req.body.acceptingTotalScore;
    const data = await prisma.acceptingauthorities.create({ data: { id: newId(), employeeId: String(req.body.employeeId), acceptingAuthorityId: acceptingAuthorityId == null ? null : String(acceptingAuthorityId), currentFinancialYear, acceptingAssessment: req.body.acceptingAssessment || '', acceptingRemarks: req.body.acceptingRemarks || '', acceptingTotalScore: score !== '' && score != null ? Number(score) : null, acceptingPlace: req.body.acceptingPlace || '', acceptingDate: req.body.acceptingDate ? new Date(req.body.acceptingDate) : null, acceptingName: req.body.acceptingName || '', acceptingDesignation: req.body.acceptingDesignation || '', ...fileColumns(fileInfo(req.files?.officerSignature?.[0])), createdAt: new Date(), updatedAt: new Date() } });
    return res.status(201).json({ success: true, message: 'Accepting Authority created successfully.', data: format(data) });
  } catch (error) { console.error('Create Accepting Authority Error:', error); return res.status(500).json({ success: false, message: 'Failed to create Accepting Authority.', error: error.message }); }
};

export const getEmployeeAcceptance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) return res.status(400).json({ success: false, message: 'Employee ID is required' });
    if (!validId(employeeId)) return res.status(400).json({ success: false, message: 'Invalid Employee ID' });
    const data = await prisma.acceptingauthorities.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' } });
    if (!data.length) return res.status(404).json({ success: false, message: 'No acceptance data found for this employee' });
    return res.status(200).json({ success: true, count: data.length, data: data.map(format) });
  } catch (error) { console.error('Acceptance API Error:', error); return res.status(500).json({ success: false, message: 'Server Error', error: error.message }); }
};
