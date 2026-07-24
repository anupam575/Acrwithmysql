import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      trim: true,
      unique: true
    },

    firstName: { 
      type: String, 
      required: true, 
      trim: true 
    },

    lastName: { 
      type: String, 
      required: true, 
      trim: true 
    },

    phoneNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },

    isActive: { 
      type: Boolean, 
      default: true 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    profilePic: {
      type: String,
      default: "https://via.placeholder.com/150",
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

     department: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Department",

      required: true,
    },

    empCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    refreshToken: { 
      type: String, 
      default: null 
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "15m" }
  );
};

userSchema.methods.getRefreshToken = async function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
  );

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.refreshToken = hashedToken;
  await this.save({ validateBeforeSave: false });

  return token;
};

userSchema.methods.clearRefreshToken = async function () {
  this.refreshToken = null;
  await this.save({ validateBeforeSave: false });
};

export default mongoose.model("User", userSchema);