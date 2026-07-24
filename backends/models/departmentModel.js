import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    department_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);