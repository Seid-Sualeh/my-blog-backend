const authService = require("./auth.service");
const { validateWriterRegistration, validateWriterLogin, handleValidationErrors } = require("../../middlewares/validation");
const { authenticateToken } = require("../../middlewares/auth");
const { authLimiter } = require("../../middlewares/rateLimit");

class AuthController {
  // Sign up new writer
  async signUp(req, res, next) {
    try {
      const result = await authService.signUp(req.body);

      res.status(201).json({
        success: true,
        message: "Writer registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login writer
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current writer (for session management)
  async getCurrentWriter(req, res, next) {
    try {
      const writer = await authService.getWriterById(req.params.writerId);

      res.status(200).json({
        success: true,
        message: "Writer fetched successfully",
        data: { writer },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const { writerId } = req.writer;
      const result = await authService.refreshToken(writerId);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side token invalidation)
  async logout(req, res, next) {
    try {
      // In a JWT implementation, logout is typically handled client-side
      // by removing the token from storage. Server-side logout would require
      // token blacklisting which adds complexity.
      
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

// Apply validation and rate limiting to routes
AuthController.prototype.signUp = [
  authLimiter,
  validateWriterRegistration,
  new AuthController().signUp
];

AuthController.prototype.login = [
  authLimiter,
  validateWriterLogin,
  new AuthController().login
];

AuthController.prototype.refreshToken = [
  authenticateToken,
  new AuthController().refreshToken
];

module.exports = new AuthController();