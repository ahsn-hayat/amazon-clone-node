const express = require("express");
const Product = require("../models/product");
const User = require("../models/user");
const auth = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/api/cart", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user).populate({ path: "cart.product" });

    return res.json({ cart: user.cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.post("/api/cart/addToCart", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let product = await Product.findById(productId);
    let user = await User.findById(req.user);

    if (!product) return res.status(400).json({ msg: "Product not found" });

    let isProductFound = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product.toString() === productId) {
        if (product.quantity > quantity) {
          let cartItem = user.cart[i];
          cartItem.quantity += quantity;
          product.quantity -= quantity;
          isProductFound = true;
          break;
        } else {
          return res.status(400).json({ msg: "Out of stock!" });
        }
      }
    }
    if (!isProductFound) {
      if (product.quantity < quantity)
        return res.status(400).json({ msg: "Out of stock!" });
      user.cart.push({ product: productId, quantity });
      product.quantity -= quantity;
    }

    await product.save();
    await user.save();

    return res.json({ msg: "Product added to cart!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.post("/api/cart/decreaseQuantity", auth, async (req, res) => {
  const { productId } = req.body;

  let product = await Product.findById(productId);
  let user = await User.findById(req.user);

  if (!product) return res.status(400).json({ msg: "Product not found" });

  let cartItem = user.cart.find(
    (cartItem) => cartItem.product.toString() == productId
  );

  if (!cartItem)
    return res.status(400).json({ msg: "Product not found in cart." });

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    product.quantity += 1;
  } else {
    return res.status(400).json({ msg: "Quantity can not be less than 1." });
  }

  await user.save();
  await product.save();
  return res.json({ msg: "Success" });
});

userRouter.delete(
  "/api/cart/removeFromCart/:productId",
  auth,
  async (req, res) => {
    const { productId } = req.params;

    let product = await Product.findById(productId);
    let user = await User.findById(req.user);

    if (!product) return res.status(400).json({ msg: "Product not found" });

    let cartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product.toString() == productId
    );

    if (cartItemIndex < 0)
      return res.status(400).json({ msg: "Product not found in cart." });

    product.quantity += user.cart[cartItemIndex].quantity;
    user.cart.splice(cartItemIndex, 1);

    await user.save();
    await product.save();
    return res.json({ msg: "Success" });
  }
);

module.exports = userRouter;
