const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss");

// Sanitize user input from NoSQL injection attacks
const sanitizeQuery = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Attempted NoSQL injection detected on query: ${key}`);
  },
});

// Sanitize user input from NoSQL injection attacks for request body
const sanitizeBody = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Attempted NoSQL injection detected on body: ${key}`);
  },
});

// XSS protection - clean user input from malicious HTML
const xssProtection = (req, res, next) => {
  const cleanObject = (obj) => {
    if (typeof obj === "string") {
      return xss(obj, {
        whiteList: {}, // Remove all HTML tags
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
      });
    }
    
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map(cleanObject);
      }
      
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = cleanObject(value);
      }
      return cleaned;
    }
    
    return obj;
  };

  // Clean request body
  if (req.body && typeof req.body === "object") {
    req.body = cleanObject(req.body);
  }

  // Clean query parameters
  if (req.query && typeof req.query === "object") {
    req.query = cleanObject(req.query);
  }

  // Clean URL parameters
  if (req.params && typeof req.params === "object") {
    req.params = cleanObject(req.params);
  }

  next();
};

// Content Security Policy
const contentSecurityPolicy = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Hide sensitive information
const hidePoweredBy = helmet.hidePoweredBy();

// Prevent clickjacking
const frameguard = helmet.frameguard();

// Prevent MIME type sniffing
const noSniff = helmet.noSniff();

// XSS Protection header
const xssFilter = helmet.xssFilter();

// Force HTTPS in production
const hsts = helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
});

module.exports = {
  sanitizeQuery,
  sanitizeBody,
  xssProtection,
  securityHeaders: {
    contentSecurityPolicy,
    hidePoweredBy,
    frameguard,
    noSniff,
    xssFilter,
    hsts,
  },
};