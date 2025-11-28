const jwt = require("jsonwebtoken");
const Writer = require("../domains/writer/writer.model");
const config = require("../config");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Get writer details
    const writer = await Writer.findById(decoded.writerId);
    
    if (!writer || !writer.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive writer",
      });
    }

    // Add writer to request object
    req.writer = writer;
    req.writerId = writer._id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

// Middleware to check if writer is owner of resource
const authorizeOwner = (resourceField = "writer") => {
  return async (req, res, next) => {
    try {
      if (!req.writer) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const resourceId = req.params.id;
      const resourceOwnerId = req.body[resourceField] || req[resourceField];

      if (req.writer._id.toString() !== resourceOwnerId?.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You can only modify your own resources",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const writer = await Writer.findById(decoded.writerId);
      
      if (writer && writer.isActive) {
        req.writer = writer;
        req.writerId = writer._id;
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeOwner,
  optionalAuth,
};