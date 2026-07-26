const env = require("../config/env");

const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for field: ${field}`;
    error.statusCode = 409;
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = "Validation Error";
    error.errors = messages;
    error.statusCode = 422;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }

  const finalStatusCode = error.statusCode || err.statusCode || 500;

  if (env.NODE_ENV !== "test" && finalStatusCode >= 500) {
    console.error(err);
  }

  res.status(finalStatusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors || [],
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
