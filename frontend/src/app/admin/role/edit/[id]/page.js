"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast,{Toaster} from "react-hot-toast";
import API from "../../../../../utils/axiosInstance";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RoleManager=()=>{
const {id}=useParams();
const router=useRouter();

const [roleName,setRoleName]=useState("");
const [originalName,setOriginalName]=useState("");
const [loading,setLoading]=useState(false);
const [fetching,setFetching]=useState(true);

const fetchRole=async()=>{
 try{
  setFetching(true);
  const res=await API.get(`/roles/${id}`);
  if(res.data.success){
    const name=res.data.role.role_name;
    setRoleName(name);
    setOriginalName(name);
  }
 }catch(err){
  toast.error(err.response?.data?.message||"Failed to fetch role");
  router.push("/admin/role");
 }finally{
  setFetching(false);
 }
};

useEffect(()=>{ if(id){ fetchRole(); } },[id]);

const handleChange=(e)=>setRoleName(e.target.value);

const updateRole=async()=>{
 const trimmed=roleName.trim();
 if(!trimmed) return toast.error("Role name is required");
 if(trimmed===originalName) return toast.error("No changes detected");
 try{
  setLoading(true);
  const res=await API.put(`/roles/${id}`,{role_name:trimmed});
  if(res.data.success){
    toast.success("Role updated successfully 🎉");
    setTimeout(()=>router.push("/admin/role"),800);
  }
 }catch(err){
  toast.error(err.response?.data?.message||"Update failed");
 }finally{
  setLoading(false);
 }
};

return (
<div className="min-h-screen bg-slate-100 p-3 md:p-6">
<Toaster position="top-right"/>
<div className="mx-auto max-w-5xl">
<div className="overflow-hidden rounded-xl border bg-white shadow">
<div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"/>
<div className="bg-[#0b3a6f] p-6 text-white flex items-center gap-4">
<div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center"><AdminPanelSettingsIcon/></div>
<div><h1 className="text-2xl font-bold">Update Role</h1><p className="text-blue-100 text-sm">Modify role information.</p></div>
</div>

{fetching?(
<div className="py-20 flex flex-col items-center">
<AccessTimeIcon className="animate-spin !text-4xl text-blue-700"/>
<p className="mt-3">Loading role...</p>
</div>
):(
<div className="p-6">
<label className="block text-xs font-bold uppercase mb-2">Role Name</label>
<input
type="text"
value={roleName}
onChange={handleChange}
disabled={loading}
placeholder="Enter role name"
className="w-full h-11 rounded-md border border-slate-300 px-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-700"/>

<div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
<button
onClick={()=>router.push("/admin/role")}
className="border rounded-md px-5 py-2.5 font-bold flex items-center justify-center gap-2">
<ArrowBackIcon fontSize="small"/>Cancel
</button>

<button
onClick={updateRole}
disabled={loading}
className="bg-blue-800 hover:bg-blue-900 text-white rounded-md px-5 py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
{loading?<><AccessTimeIcon fontSize="small" className="animate-spin"/>Updating...</>:<><SaveIcon fontSize="small"/>Update Role</>}
</button>
</div>
</div>
)}
</div>
</div>
</div>
);
};

export default RoleManager;