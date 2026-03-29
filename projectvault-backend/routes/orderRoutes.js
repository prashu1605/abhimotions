const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const AuditLog = require("../models/AuditLog");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ---------------- USER ROUTE ----------------

// Get ALL orders for logged-in user (for UI)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ---------------- ADMIN ROUTES ----------------

// Admin test
router.get(
  "/admin-test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// Get pending orders
router.get(
  "/admin/pending",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find({
        status: "PENDING_VERIFICATION",
      })
        .populate("user", "name email")
        .populate("project", "title price");

      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
);

// Approve / Reject
router.post(
  "/admin/update-status/:orderId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["PAID", "REJECTED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const previousStatus = order.status;

      order.status = status;
      await order.save();

      await AuditLog.create({
        order: order._id,
        previousStatus,
        newStatus: status,
        note: status === "PAID" ? "Approved by admin" : "Rejected by admin",
      });

      res.json({ message: `Order ${status}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update order" });
    }
  }
);

// DELETE ORDER (only if not paid)
router.delete("/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow same user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent deleting paid orders
    if (order.status === "PAID") {
      return res.status(400).json({ message: "Cannot delete paid order" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
