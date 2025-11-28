const express = require("express");
const router = express.Router();
const { writerController } = require("../domains");
const Writer = require("../domains/writer/writer.model");
const bcrypt = require("bcrypt");

// Writer CRUD routes
router.post("/", writerController.createWriter);
router.get("/", writerController.getAllWriters);
router.get("/:id", writerController.getWriterById);
router.put("/:id", writerController.updateWriter);
router.delete("/:id", writerController.deleteWriter);

// Additional writer routes
router.get("/:id/stats", writerController.getWriterStats);
router.patch("/:id/deactivate", writerController.deactivateWriter);

// Login endpoint for writers
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find writer by email and include password
    const writer = await Writer.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, writer.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Return writer data (exclude password)
    const { password: _, ...writerData } = writer.toObject();
    
    res.json({
      success: true,
      writer: writerData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
