import AppError from "../utils/AppError.js";

const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // Mongo duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const value = err.keyValue?.[field];

    error = new AppError(
      `${field} '${value}' already exists`,
      409
    );
  }

  // Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (el) => el.message
    );

    error = new AppError(messages.join(", "), 400);
  }

  // ONLY ONE LOG PLACE
  console.error("API ERROR:", {
    message: error.message,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default globalErrorHandler;