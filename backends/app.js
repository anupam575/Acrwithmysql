import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./route/userRoute.js";
import adminRoutes from "./route/adminroute.js";
import departmentRoutes from "./route/depart.route.js";
import categoryRoutes from "./route/categoryRoutes.js";
import roleRoutes from "./route/roleRoute.js";
import designationRoutes from "./route/designationRoute.js";
import employeeRoutes from "./route/employeeRoutes.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import SelfAppraisal from "./route/selfAppraisalRoutes.js";
import report from "./route/reporter.js"
import review from "./route/reviewRoutes.js"
import supervisorRoutes from "./route/supervisorRoutes.js";
import acceptroute from"./route/acceptroute.js";
dotenv.config();

const app = express();

/* =========================
   FIX __dirname (ES MODULE SAFE)
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   ENV CONFIG
========================= */
const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || "*";

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/designations", designationRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/self-appraisal", SelfAppraisal);
app.use("/api/v1/reporter", report)
app.use("/api/v1/review", review)
app.use("/api/v1/supervisors", supervisorRoutes)
app.use("/api/v1/accept", acceptroute)
/* =========================
   STATIC FILES (UPLOADS)
   👉 PRODUCTION FIX
========================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "1d", // caching for performance
    etag: true,
    lastModified: true,
  })
);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Backend running perfectly!",
  });
});


/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});
app.use(globalErrorHandler);

export default app;