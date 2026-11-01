import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError.js';
import {prisma,newId,parse,arr,date,num,fileObject,fileFields,fileFrom,asMongo} from './prismaCompat.js';
import {createMasterEmployee,updateMasterEmployee,checkDuplicateEmployee} from './masterEmployee.service.js';
const baseModels=[prisma.employeenews,prisma.employeedetails];
const auth = b => { const x=parse(b.authorities,{}) || {}; return {reporting:arr(x.reporting ?? b['authorities.reporting']),reviewing:arr(x.reviewing ?? b['authorities.reviewing']),accepting:arr(x.accepting ?? b['authorities.accepting'])}; };
const common = (b, source, userId, old=null) => {
 const basic=source==='EmployeeNew'; const payload={employeeCode:b.employeeCode??old?.employeeCode??null,email:b.email?.trim().toLowerCase()??old?.email??null,phoneNumber:b.phoneNumber??old?.phoneNumber??null,role_id:b.role??old?.role_id??null,category_id:b.category??old?.category_id??null,updatedAt:new Date()};
 
 if (basic) Object.assign(payload,{employee_name:b.employee_name??old?.employee_name??null,pay_scale:b.pay_scale??old?.pay_scale??null,basic_pay:num(b.basic_pay)??old?.basic_pay??null,date_of_birth:date(b.date_of_birth)??old?.date_of_birth??null,date_of_joining:date(b.date_of_joining)??old?.date_of_joining??null,date_of_appointment:date(b.date_of_appointment)??old?.date_of_appointment??null,educationalProfessionalQualifications_json:parse(b.educationalProfessionalQualifications,old?.educationalProfessionalQualifications_json??{}),basicTrainings_json:arr(b.basicTrainings??old?.basicTrainings_json),basicLeaves_json:arr(b.basicLeaves??old?.basicLeaves_json),authorities_json:b.authorities===undefined&&b['authorities.reporting']===undefined ? old?.authorities_json??auth(b) : auth(b),designations_json:arr(b.designations??old?.designations_json),...(userId?{[old?'updatedBy_id':'createdBy_id']:String(userId)}:{})});
 else Object.assign(payload,{EmployeeName:b.EmployeeName??old?.EmployeeName??null,dateOfBirth:date(b.dateOfBirth)??old?.dateOfBirth??null,academicProfessionalQualifications:b.academicProfessionalQualifications??old?.academicProfessionalQualifications??null,currentPost_name:parse(b.currentPost,{})?.name??old?.currentPost_name??null,currentPost_grade:parse(b.currentPost,{})?.grade??old?.currentPost_grade??null,currentPost_payScale:parse(b.currentPost,{})?.payScale??old?.currentPost_payScale??null,propertyReturnDate:date(b.propertyReturnDate)??old?.propertyReturnDate??null,propertyReturnYear:num(b.propertyReturnYear)??old?.propertyReturnYear??null,officersNotReportedPAR:num(b.officersNotReportedPAR) == null ? old?.officersNotReportedPAR??null : BigInt(num(b.officersNotReportedPAR)),...(userId&&!old?{createdBy_id:String(userId)}:{})});
 return payload;
};
const childData=(b,old)=>({
 employeedetail_authorities:{create:['reporting','reviewing','accepting'].flatMap(type=>arr(auth(b)[type]).map((a,i)=>({authority_type:type,authority_index:i,authority_record_id:a._id||null,authority_name_id:a.name||null,designation_id:a.designation||null,from_date:date(a.from),to_date:date(a.to)})))},
 employeedetail_designations:{create:arr(b.designations).filter(Boolean).map(d=>({designation_id:String(d._id||d)}))},
 employeedetail_absences:{create:arr(b.absenceRecords).map(a=>({from_date:date(a.from),to_date:date(a.to),remarks:a.remarks||null,specify:a.specify||null,category:a.category||null,leaveType:a.leaveType||null}))},
 employeedetail_training:{create:arr(b.trainingPrograms).map(a=>({from_date:date(a.from),to_date:date(a.to),subject:a.subject||null,institute:a.institute||null}))},
 employeedetail_awards:{create:arr(b.awards).map(a=>({award_year:num(a.year),title:a.title||null,description:a.description||null}))}
});
const detailInclude={employeedetail_authorities:true,employeedetail_designations:true,employeedetail_absences:true,employeedetail_training:true,employeedetail_awards:true};
export const employeeRecord = (r,source) => {
 if(!r) return null;
 if(source==='EmployeeNew') return asMongo(r,{role:r.role_id,category:r.category_id,designations:arr(r.designations_json),authorities:r.authorities_json??{},basicTrainings:arr(r.basicTrainings_json),basicLeaves:arr(r.basicLeaves_json),educationalProfessionalQualifications:r.educationalProfessionalQualifications_json??{},_id:r.id});
 const authorities=['reporting','reviewing','accepting'].reduce((o,k)=>(o[k]=(r.employeedetail_authorities||[]).filter(a=>a.authority_type===k).sort((a,b)=>a.authority_index-b.authority_index).map(a=>({name:a.authority_name_id,designation:a.designation_id,from:a.from_date,to:a.to_date})),o),{});
 return asMongo(r,{role:r.role_id,category:r.category_id,designations:(r.employeedetail_designations||[]).map(d=>d.designation_id),authorities,currentPost:{name:r.currentPost_name,grade:r.currentPost_grade,payScale:r.currentPost_payScale},absenceRecords:(r.employeedetail_absences||[]).map(a=>({from:a.from_date,to:a.to_date,remarks:a.remarks,specify:a.specify,category:a.category,leaveType:a.leaveType})),trainingPrograms:(r.employeedetail_training||[]).map(a=>({from:a.from_date,to:a.to_date,subject:a.subject,institute:a.institute})),awards:(r.employeedetail_awards||[]).map(a=>({year:a.award_year,title:a.title,description:a.description})),officerSignature:fileFrom(r,'officerSignature'),recentPhotograph:fileFrom(r,'recentPhotograph')});
};
const create=async (b,source,userId,files={})=>{
 if(!b.employeeCode||!b.email||!b.password) throw new AppError('employeeCode, email, password required',400);
 await checkDuplicateEmployee({models:[...baseModels,prisma.masteremployees],employeeCode:b.employeeCode,email:b.email,phoneNumber:b.phoneNumber});
 const model=source==='EmployeeNew'?prisma.employeenews:prisma.employeedetails;
 const data=common(b,source,userId); data.id=newId(); data.createdAt=new Date(); data.password=await bcrypt.hash(b.password,10);
 if(source==='EmployeeDetail'){Object.assign(data,fileFields(fileObject(files.recentPhotograph?.[0]),'recentPhotograph'),fileFields(fileObject(files.officerSignature?.[0]),'officerSignature'));Object.assign(data,childData(b));}
 const employee=await model.create({data,include:source==='EmployeeDetail'?detailInclude:undefined});
 try {await createMasterEmployee({employeeRefId:employee.id,sourceModel:source,employeeCode:employee.employeeCode,email:employee.email,phoneNumber:employee.phoneNumber,password:employee.password,role:employee.role_id,category:employee.category_id,designations:arr(b.designations),authorities:auth(b)});} catch(e){console.error('Master employee synchronization failed',e);throw e;}
 const result=employeeRecord(employee,source);delete result.password;return result;
};
const update=async (id,b,source,userId,files={})=>{
 const model=source==='EmployeeNew'?prisma.employeenews:prisma.employeedetails;
 const existing=await model.findUnique({where:{id:String(id)},include:source==='EmployeeDetail'?detailInclude:undefined});
 if(!existing) throw new AppError('Employee not found',404);
 await checkDuplicateEmployee({models:[...baseModels,prisma.masteremployees],employeeCode:b.employeeCode,email:b.email,phoneNumber:b.phoneNumber,excludeId:id});
 const data=common(b,source,userId,existing); if(b.password) data.password=await bcrypt.hash(b.password,10);
 if(source==='EmployeeDetail') {
   if(files.recentPhotograph?.[0]) Object.assign(data,fileFields(fileObject(files.recentPhotograph[0]),'recentPhotograph'));
   if(files.officerSignature?.[0]) Object.assign(data,fileFields(fileObject(files.officerSignature[0]),'officerSignature'));
 }
 const employee=await prisma.$transaction(async tx=>{
   if(source==='EmployeeDetail') {
     for(const name of ['employeedetail_authorities','employeedetail_designations','employeedetail_absences','employeedetail_training','employeedetail_awards']) {
       if(name==='employeedetail_authorities' && b.authorities===undefined && b['authorities.reporting']===undefined) continue;
       if(name==='employeedetail_designations' && b.designations===undefined) continue;
       if(name==='employeedetail_absences' && b.absenceRecords===undefined) continue;
       if(name==='employeedetail_training' && b.trainingPrograms===undefined) continue;
       if(name==='employeedetail_awards' && b.awards===undefined) continue;
       await tx[name].deleteMany({where:{employee_id:String(id)}});
       data[name]=childData(b)[name];
     }
   }
   return tx[source==='EmployeeNew'?'employeenews':'employeedetails'].update({where:{id:String(id)},data,include:source==='EmployeeDetail'?detailInclude:undefined});
 });
 await updateMasterEmployee({employeeRefId:employee.id,sourceModel:source,employeeCode:employee.employeeCode,email:employee.email,phoneNumber:employee.phoneNumber,password:employee.password,role:employee.role_id,category:employee.category_id,designations:b.designations===undefined?undefined:arr(b.designations),authorities:b.authorities===undefined&&b['authorities.reporting']===undefined?undefined:auth(b)});
 const result=employeeRecord(employee,source);delete result.password;return result;
};
export const employeeService={createEmployee:req=>create(req.body,'EmployeeDetail',req.user?._id,req.files)};
export const basicemployeeService={createEmployee:({body,userId})=>create(body,'EmployeeNew',userId)};
export const updateemployeeService={updateEmployee:req=>update(req.params.id,req.body,'EmployeeDetail',req.user?._id,req.files)};
export const updatebasicemployeeService={updateEmployee:({employeeId,body,userId})=>update(employeeId,body,'EmployeeNew',userId)};
