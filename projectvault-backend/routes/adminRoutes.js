const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// APPROVE ORDER
router.post(
  '/orders/:orderId/approve',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status === 'PAID') {
        return res.status(400).json({ message: 'Order already approved' });
      }

      order.status = 'PAID';
      order.approvedBy = req.user._id;
      order.approvedAt = new Date();

      await order.save();

      res.json({ message: 'Order approved successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

// GET PENDING ORDERS
router.get(
  '/orders',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const orders = await Order.find({ status: 'PENDING' })
      .populate('user')
      .populate('project');

    res.json(orders);
  }
);
