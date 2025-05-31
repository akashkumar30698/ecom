const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success"
  },
  method: {
    type: String
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
