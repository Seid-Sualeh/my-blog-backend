const express = require("express");
const router = express.Router();
const { authController } = require("../domains");

// Authentication routes
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/writer/:writerId", authController.getCurrentWriter);

module.exports = router;