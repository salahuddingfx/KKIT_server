const rateLimit = require("express-rate-limit");

const isDev = process.env.NODE_ENV !== "production";

// General API rate limiter: relaxed in development
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 2000 : 60,
  skip: () => isDev,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes: relaxed in development
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 500 : 10,
  skip: () => isDev,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact/form limiter: relaxed in development
const formLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 100 : 5,
  skip: () => isDev,
  message: {
    success: false,
    message: "Too many form submissions, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, formLimiter };
