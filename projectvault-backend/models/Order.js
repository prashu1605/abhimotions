const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PENDING_VERIFICATION", "PAID", "REJECTED","FAILED"],
      default: "PENDING",
    },
    approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
approvedAt: {
  type: Date
},
paymentGateway: {
      type: String,
      default: "MANUAL_UPI",
    },
    utr: {
      type: String,
    },
    paymentId: {
      type: String,
    },

downloadCount: {
  type: Number,
  default: 0,
},
lastDownloadedAt: {
  type: Date,
},
    
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
