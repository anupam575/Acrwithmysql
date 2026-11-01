
import mongoose from "mongoose";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";

// Prisma Client for MySQL
export const prisma = new PrismaClient();

// Database connection
const connectDatabase = async () => {
  try {
    // 1. Connect to MySQL
    await prisma.$connect();
    console.log("✅ MySQL connected successfully using Prisma");

    // 2. MongoDB connection (temporarily retained)
    // Enable only when existing MongoDB APIs need to run.
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected successfully");
    }

  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
