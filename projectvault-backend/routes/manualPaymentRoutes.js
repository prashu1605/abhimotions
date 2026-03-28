const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// ---------------- CREATE MANUAL PAYMENT ORDER ----------------
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Prevent duplicate active orders
const existingOrder = await Order.findOne({
  user: req.user._id,
  project: projectId,
  status: { $in: ["PENDING", "PENDING_VERIFICATION", "PAID"] },
});

if (existingOrder) {
  return res.status(400).json({
    message: "You already have an active order for this project",
  });
}


    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const order = await Order.create({
      user: req.user._id,          
      project: project._id,
      amount: project.price,
      status: "PENDING",
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
});

// ---------------- SUBMIT UTR ----------------
router.post("/submit-utr/:orderId", authMiddleware, async (req, res) => {
  try {
    const { utr } = req.body;

    if (!utr) {
      return res.status(400).json({ message: "UTR is required" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional safety: ensure same user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.utr = utr;
    order.status = "PENDING_VERIFICATION";
    await order.save();

    return res.json({ message: "Payment submitted for verification" });
  } catch (err) {
    console.error("SUBMIT UTR ERROR:", err);
    return res.status(500).json({ message: "Failed to submit UTR" });
  }
});

module.exports = router;
