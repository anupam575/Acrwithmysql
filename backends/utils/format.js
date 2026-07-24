// ================= DATE =================
export const formatDate = (val) => {
  if (!val) return "";

  const raw = val?.$date || val;
  const d = new Date(raw);

  if (isNaN(d.getTime())) return "";

  return d.toISOString().split("T")[0];
};

// ================= ID =================
export const getId = (val) => {
  if (!val) return "";
  if (typeof val === "object") {
    return val._id?.toString?.() || val.$oid || "";
  }
  return String(val);
};