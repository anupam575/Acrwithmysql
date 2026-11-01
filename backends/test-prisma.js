
import { prisma } from "./config/database.js";

async function testConnection() {
  try {
    await prisma.$connect();

    console.log("MySQL connected successfully");

    const count = await prisma.users.count();

    console.log("Total Users:", count);
  } catch (error) {
    console.error("Prisma connection error:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
