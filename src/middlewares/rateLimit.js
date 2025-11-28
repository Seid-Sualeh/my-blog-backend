const rateLimit = require("express-rate-limit");
const config = require("../config");

// General API rate limiting
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || "Too many requests, please try again later",
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// Different rate limiters for different endpoints
const authLimiter = createRateLimiter(
  config.rateLimitWindowMs,
  5, // 5 requests per window
  "Too many authentication attempts, please try again later"
);

const generalLimiter = createRateLimiter(
  config.rateLimitWindowMs,
  config.rateLimitMaxRequests,
  "Too many requests from this IP, please try again later"
);

const uploadLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 uploads per 15 minutes
  "Too many file uploads, please try again later"
);

// Strict limiter for password reset
const passwordResetLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 password reset attempts per hour
  "Too many password reset attempts, please try again in an hour"
);

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  passwordResetLimiter,
};