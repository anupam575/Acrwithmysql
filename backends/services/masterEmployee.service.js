
import { prisma,newId,arr,date,asMongo } from './prismaCompat.js';
import AppError from '../utils/AppError.js';
const normalize = v => v == null ? null : String(v).trim();
export const checkDuplicateEmployee = async ({models=[],employeeCode,email,phoneNumber,excludeId=null}) => {
  const filters=[employeeCode && {employeeCode:normalize(employeeCode)},email && {email:normalize(email).toLowerCase()},phoneNumber && {phoneNumber:normalize(phoneNumber)}].filter(Boolean);
  if (!filters.length) return;
  for (const model of models) {
    const isMaster=model===prisma.masteremployees; const exclusion=excludeId ? (isMaster?{employeeRefId:{not:String(excludeId)}}:{id:{not:String(excludeId)}}) : {}; const found=await model.findFirst({where:{OR:filters,...exclusion}});
    if (found) throw new AppError('EmployeeCode, Email or Phone number already exists',409);
  }
};
const buildChildren = (authorities={},designations=[]) => ({
 masteremployee_authorities:{create:['reporting','reviewing','accepting'].flatMap(type=>arr(authorities[type]).map((r,index)=>({authority_type:type,authority_index:index,authority_record_id:r._id || null,authority_name_id:r.name?String(r.name):null,designation_id:r.designation?String(r.designation):null,from_date:date(r.from),to_date:date(r.to)})))},
 masteremployee_designations:{create:arr(designations).filter(Boolean).map(d=>({designation_id:String(d._id || d)}))}
});
export const createMasterEmployee = async p => {
 const ref=String(p.employeeRefId); const existing=await prisma.masteremployees.findFirst({where:{employeeRefId:ref}});
 const payload={employeeRefId:ref,sourceModel:p.sourceModel||'EmployeeNew',employeeCode:normalize(p.employeeCode),email:normalize(p.email)?.toLowerCase(),phoneNumber:normalize(p.phoneNumber),password:p.password,role_id:p.role||null,category_id:p.category||null,updatedAt:new Date()};
 await checkDuplicateEmployee({models:[prisma.masteremployees],employeeCode:payload.employeeCode,email:payload.email,phoneNumber:payload.phoneNumber,excludeId:ref});
 if (existing) {
   return prisma.$transaction(async tx=>{await tx.masteremployee_authorities.deleteMany({where:{employee_id:existing.id}});await tx.masteremployee_designations.deleteMany({where:{employee_id:existing.id}});return tx.masteremployees.update({where:{id:existing.id},data:{...payload,...buildChildren(p.authorities,p.designations)}});});
 }
 // FIX: naya employee hamesha active ban kar create hoga
 return prisma.masteremployees.create({data:{id:newId(),createdAt:new Date(),isActive:true,...payload,...buildChildren(p.authorities,p.designations)}});
};
export const updateMasterEmployee = async p => {
 const existing=await prisma.masteremployees.findFirst({where:{employeeRefId:String(p.employeeRefId)},include:{masteremployee_authorities:true}});
 if (!existing) throw new AppError('MasterEmployee not found',404);
 return createMasterEmployee({...p,sourceModel:p.sourceModel??existing.sourceModel,employeeCode:p.employeeCode??existing.employeeCode,email:p.email??existing.email,phoneNumber:p.phoneNumber??existing.phoneNumber,password:p.password??existing.password,role:p.role??existing.role_id,category:p.category??existing.category_id,designations:p.designations??(await prisma.masteremployee_designations.findMany({where:{employee_id:existing.id}})).map(x=>x.designation_id),authorities:p.authorities??Object.fromEntries(['reporting','reviewing','accepting'].map(t=>[t,(existing.masteremployee_authorities||[]).filter(a=>a.authority_type===t).map(a=>({name:a.authority_name_id,designation:a.designation_id,from:a.from_date,to:a.to_date}))]))});
};
export const masterAsMongo = r => asMongo(r,{role:r.role_id,category:r.category_id,designations:(r.masteremployee_designations||[]).map(x=>x.designation_id),authorities:['reporting','reviewing','accepting'].reduce((o,t)=>(o[t]=(r.masteremployee_authorities||[]).filter(a=>a.authority_type===t).sort((a,b)=>a.authority_index-b.authority_index).map(a=>({name:a.authority_name_id,designation:a.designation_id,from:a.from_date,to:a.to_date})),o),{})});
