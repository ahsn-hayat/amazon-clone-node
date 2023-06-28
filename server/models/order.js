const mongoose = require("mongoose");
const cartItemSchema = require("./cartItem");

const orderSchema = mongoose.Schema({
  orderItems: [cartItemSchema],
  address: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  totalBill: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
