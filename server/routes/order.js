const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const admin = require("../middlewares/admin");
const orderRouter = express.Router();

orderRouter.post("/api/order/placeOrder", auth, async (req, res) => {
  try {
    const { address } = req.body;

    let user = await User.findById(req.user).populate({ path: "cart.product" });
    if (user.cart.length == 0)
      return res.status(400).json({ msg: "Cart is empty!" });
    let totalBill = 0;
    let orderItems = [];
    for (let i = 0; i < user.cart.length; i++) {
      totalBill += user.cart[i].product.price * user.cart[i].quantity;
      orderItems.push({
        product: user.cart[i].product._id,
        quantity: user.cart[i].quantity,
      });
    }

    let order = new Order({
      orderItems: orderItems,
      address: address,
      totalBill: totalBill,
      user: req.user,
    });

    user.cart = [];
    await user.save();
    await order.save();

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

orderRouter.get("/api/order/me", auth, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user }).populate({
      path: "orderItems.product",
      select: "title images",
    });
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

orderRouter.get("/api/order/allOrders", admin, async (req, res) => {
    try {
      let orders = await Order.find({ user: req.user }).populate({
        path: "orderItems.product",
        select: "title images",
      });
      return res.json({ orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  


module.exports = orderRouter;
