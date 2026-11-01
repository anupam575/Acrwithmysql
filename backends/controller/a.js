// Prisma replacement for the supplied updateemployeeService.updateEmployee.
// IMPORTANT: This method CREATES an employee, as in the original service.
import { randomBytes } from 'node:crypto';
import { prisma } from '../config/database.js';

const newId = () => randomBytes(12).toString('hex');
const parseObject = v => { if (!v) return {}; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch { return {}; } };
const parseJSON = v => { const x = parseObject(v); return Array.isArray(x) ? x : []; };
const dateOrNull = v => v && !Number.isNaN(new Date(v).getTime()) ? new Date(v) : null;
const ref = v => { if (v == null || v === '') return null; if (typeof v === 'object') return String(v._id ?? v.id ?? v.value ?? v.name ?? '') || null; return String(v); };
const fileColumns = (file, prefix) => file ? {
  [`${prefix}_url`]: `/uploads/${file.filename}`,
  [`${prefix}_public_id`]: file.filename,
  [`${prefix}_originalName`]: file.originalname,
  [`${prefix}_mimeType`]: file.mimetype,
  [`${prefix}_size`]: BigInt(file.size ?? 0),
} : {};
const serialize = value => JSON.parse(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? Number(v) : v));
const conflict = message => { const err = new Error(message); err.statusCode = 409; throw err; };
const required = message => { const err = new Error(message); err.statusCode = 400; throw err; };
const first = (obj, ...keys) => keys.map(k => obj?.[k]).find(v => v != null && v !== '');

export const updateemployeeService = {
  updateEmployee: async req => {
    const { employeeCode, email, password } = req.body;
    if (!employeeCode || !email || !password) required('employeeCode, email, password required');
    const code = String(employeeCode).trim();
    const normalizedEmail = String(email).toLowerCase().trim();
    const body = req.body;
    const authorities = {
      reporting: parseJSON(body['authorities.reporting']),
      reviewing: parseJSON(body['authorities.reviewing']),
      accepting: parseJSON(body['authorities.accepting']),
    };
    const currentPost = parseObject(body.currentPost);
    const appointment = parseObject(body.firstPublicEnterpriseAppointment);
    const absences = parseJSON(body.absenceRecords);
    const awards = parseJSON(body.awards);
    const training = parseJSON(body.trainingPrograms);
    const designations = parseJSON(body.designations ?? body.designation);

    // Match duplicate behavior across both detail and master employee tables.
    const [codeDetail, emailDetail, codeMaster, emailMaster] = await Promise.all([
      prisma.employeedetails.findFirst({ where: { employeeCode: code } }),
      prisma.employeedetails.findFirst({ where: { email: normalizedEmail } }),
      prisma.masteremployees.findFirst({ where: { employeeCode: code } }),
      prisma.masteremployees.findFirst({ where: { email: normalizedEmail } }),
    ]);
    if (codeDetail || codeMaster) conflict('Employee code already exists');
    if (emailDetail || emailMaster) conflict('Email already exists');

    const employeeId = newId();
    const masterId = newId();
    const now = new Date();
    const authorityRows = Object.entries(authorities).flatMap(([type, items]) => items.map((item, index) => ({
      authority_type: type, authority_index: index,
      authority_record_id: ref(item?._id ?? item?.id),
      authority_name_id: ref(first(item, 'name', 'authorityName', 'authority', 'officerId')),
      designation_id: ref(first(item, 'designation', 'designationId')),
      from_date: dateOrNull(first(item, 'fromDate', 'from_date')),
      to_date: dateOrNull(first(item, 'toDate', 'to_date')),
    })));
    const employee = await prisma.$transaction(async tx => {
      const detail = await tx.employeedetails.create({ data: {
        id: employeeId, employeeCode: code,
        EmployeeName: body.officerName?.trim() || body.EmployeeName?.trim() || null,
        dateOfBirth: dateOrNull(body.dateOfBirth), email: normalizedEmail, password,
        academicProfessionalQualifications: body.academicProfessionalQualifications?.trim() || '',
        currentPost_name: first(currentPost, 'name', 'post', 'postName') ?? null,
        currentPost_grade: first(currentPost, 'grade') ?? null,
        currentPost_payScale: first(currentPost, 'payScale', 'pay_scale') ?? null,
        firstAppointmentDate: dateOrNull(first(appointment, 'date', 'appointmentDate')),
        firstAppointmentPayScale: first(appointment, 'payScale', 'pay_scale') ?? null,
        propertyReturnDate: dateOrNull(body.propertyReturnDate),
        propertyReturnYear: Number(body.propertyReturnYear || 0),
        officersNotReportedPAR: BigInt(Number(body.officersNotReportedPAR || 0)),
        role_id: ref(body.role), category_id: ref(body.category),
        createdBy_id: ref(req.user?._id), createdAt: now, updatedAt: now,
        ...fileColumns(req.files?.recentPhotograph?.[0], 'recentPhotograph'),
        ...fileColumns(req.files?.officerSignature?.[0], 'officerSignature'),
      } });
      await tx.masteremployees.create({ data: {
        id: masterId, employeeRefId: employeeId, sourceModel: 'EmployeeDetail',
        employeeCode: code, email: normalizedEmail, password,
        role_id: ref(body.role), category_id: ref(body.category),
        createdAt: now, updatedAt: now, isActive: true,
      } });
      if (authorityRows.length) {
        await tx.employeedetail_authorities.createMany({ data: authorityRows.map(row => ({ employee_id: employeeId, ...row })) });
        await tx.masteremployee_authorities.createMany({ data: authorityRows.map(row => ({ employee_id: masterId, ...row })) });
      }
      if (absences.length) await tx.employeedetail_absences.createMany({ data: absences.map(item => ({ employee_id: employeeId, mongo_record_id: ref(item?._id), from_date: dateOrNull(first(item, 'fromDate', 'from_date')), to_date: dateOrNull(first(item, 'toDate', 'to_date')), remarks: item?.remarks ?? null, specify: item?.specify ?? null, category: ref(item?.category), leaveType: item?.leaveType ?? null })) });
      if (awards.length) await tx.employeedetail_awards.createMany({ data: awards.map(item => ({ employee_id: employeeId, mongo_record_id: ref(item?._id), award_year: item?.year ? Number(item.year) : null, title: first(item, 'title', 'awardName') ?? null, description: item?.description ?? null })) });
      if (training.length) await tx.employeedetail_training.createMany({ data: training.map(item => ({ employee_id: employeeId, mongo_record_id: ref(item?._id), from_date: dateOrNull(first(item, 'fromDate', 'from_date')), to_date: dateOrNull(first(item, 'toDate', 'to_date')), subject: first(item, 'subject', 'trainingName') ?? null, institute: first(item, 'institute', 'institution') ?? null })) });
      if (designations.length) {
        const ids = designations.map(ref).filter(Boolean);
        if (ids.length) {
          await tx.employeedetail_designations.createMany({ data: ids.map(designation_id => ({ employee_id: employeeId, designation_id })) });
          await tx.masteremployee_designations.createMany({ data: ids.map(designation_id => ({ employee_id: masterId, designation_id })) });
        }
      }
      return detail;
    });
    const result = serialize({ _id: employee.id, ...employee, authorities, absenceRecords: absences, awards, trainingPrograms: training, currentPost, firstPublicEnterpriseAppointment: appointment });
    delete result.id;
    delete result.password;
    delete result.refreshToken;
    return result;
  },
};
