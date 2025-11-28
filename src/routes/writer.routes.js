const express = require("express");
const router = express.Router();
const { writerController } = require("../domains");

// Writer CRUD routes
router.post("/", writerController.createWriter);
router.get("/", writerController.getAllWriters);
router.get("/:id", writerController.getWriterById);
router.put("/:id", writerController.updateWriter);
router.delete("/:id", writerController.deleteWriter);

// Additional writer routes
router.get("/:id/stats", writerController.getWriterStats);
router.patch("/:id/deactivate", writerController.deactivateWriter);

module.exports = router;
