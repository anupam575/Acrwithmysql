// import dotenv from "dotenv";
// dotenv.config(); // ✅ correct
import 'dotenv/config';
import app from "./app.js";
import http from "http";
import cloudinary from "cloudinary";
import connectDatabase from "./config/database.js";

/* =========================
   ENV CONFIG
========================= */
// dotenv.config();

/* =========================
   UNCAUGHT EXCEPTION
========================= */
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

/* =========================
   CREATE SERVER
========================= */
const server = http.createServer(app);

/* =========================
   START SERVER
========================= */
const startServer = async () => {
  try {
    console.log("🔹 Starting server...");

    // 1️⃣ Connect Database
    await connectDatabase();
    console.log("✅ Database connected");

    // 2️⃣ Cloudinary Config
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("☁️ Cloudinary configured");

    // 3️⃣ Start Listening
    const PORT = process.env.PORT || 4000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 Frontend allowed: ${process.env.FRONTEND_URL}`);
    });

    /* =========================
       UNHANDLED PROMISE
    ========================= */
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      console.error(err.stack);

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

startServer();

export default startServer;