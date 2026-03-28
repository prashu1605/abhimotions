const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Project = require("../models/Project");
const path = require("path");
const fs = require("fs");

router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    //  Check PAID order
    const order = await Order.findOne({
      user: userId,
      project: projectId,
      status: "PAID",
    });

    if (!order) {
      return res.status(403).json({
        code: "NOT_PAID",
        message: "Payment not completed for this project",
      });
    }

    //  RATE LIMIT
    const MAX_DOWNLOADS_PER_DAY = 5;
    const now = new Date();

    if (
      !order.lastDownloadedAt ||
      now - order.lastDownloadedAt > 24 * 60 * 60 * 1000
    ) {
      order.downloadCount = 0;
    }

    if (order.downloadCount >= MAX_DOWNLOADS_PER_DAY) {
      return res.status(429).json({
        code: "DOWNLOAD_LIMIT",
        message: "Daily download limit reached",
      });
    }

    order.downloadCount += 1;
    order.lastDownloadedAt = now;
    await order.save();

    //  Get project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    //  Secure file path
    const baseDir = path.join(__dirname, "..", "protected_files");
    const filePath = path.join(baseDir, project.s3FileKey);

    if (!filePath.startsWith(baseDir)) {
      return res.status(400).json({ message: "Invalid file path" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: "FILE_MISSING",
        message: "File not found",
      });
    }

    //  Download
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});

module.exports = router;
