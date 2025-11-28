const { body, param, query, validationResult } = require("express-validator");

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Writer validation rules
const validateWriterRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  
  handleValidationErrors,
];

const validateWriterLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  handleValidationErrors,
];

const validateWriterUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  
  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),
  
  body("socialLinks.website")
    .optional()
    .isURL()
    .withMessage("Website URL must be valid"),
  
  body("socialLinks.twitter")
    .optional()
    .isURL()
    .withMessage("Twitter URL must be valid"),
  
  body("socialLinks.linkedin")
    .optional()
    .isURL()
    .withMessage("LinkedIn URL must be valid"),
  
  handleValidationErrors,
];

// Blog validation rules
const validateBlogCreation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  
  body("content")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),
  
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters"),
  
  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),
  
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value"),
  
  handleValidationErrors,
];

const validateBlogUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  
  body("content")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),
  
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters"),
  
  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),
  
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value"),
  
  handleValidationErrors,
];

// Common validation rules
const validateObjectId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  
  handleValidationErrors,
];

const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
  
  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "title", "name", "email"])
    .withMessage("Invalid sort field"),
  
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
  
  handleValidationErrors,
];

module.exports = {
  // Writer validations
  validateWriterRegistration,
  validateWriterLogin,
  validateWriterUpdate,
  
  // Blog validations
  validateBlogCreation,
  validateBlogUpdate,
  
  // Common validations
  validateObjectId,
  validateQueryParams,
  
  handleValidationErrors,
};