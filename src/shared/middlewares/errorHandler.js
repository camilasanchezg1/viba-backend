const { error } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return error(res, `The ${field} is already in use`, 409);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return error(res, "Validation error", 400, messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return error(res, "Invalid token", 401);
  }
  if (err.name === "TokenExpiredError") {
    return error(res, "Token expired", 401);
  }

  return error(res, err.message || "Internal server error", err.statusCode || 500);
};

module.exports = errorHandler;
