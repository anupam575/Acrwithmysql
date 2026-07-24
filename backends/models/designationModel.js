import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Designation name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Designation = mongoose.model("Designation", designationSchema);

export default Designation;