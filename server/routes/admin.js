const express = require("express");
const admin = require("../middlewares/admin");
const Product = require("../models/product");
const e = require("express");
const adminRouter = express.Router();

adminRouter.post("/api/admin/add-product", admin, async (req, res) => {
  const { title, description, category, images, quantity, price } = req.body;

  let product = Product({
    title,
    description,
    category,
    images,
    quantity,
    price,
    supplier: req.user,
  });

  product = await product.save();

  return res.json(product);
});

adminRouter.post(
  "/api/admin/edit-product/:productId",
  admin,
  async (req, res) => {
    const { title, description, category, images, quantity, price } = req.body;

    const { productId } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          title,
          description,
          category,
          images,
          price,
          supplier: req.user,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ msg: "Product not found!" });

    return res.json(updatedProduct);
  }
);

adminRouter.get("/api/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find().populate("supplier", "name email");
    return res.json({ products: products });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

adminRouter.delete("/api/admin/delete-products", admin, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(401).json({ msg: "No product found!" });
    return res.json({ status: true, msg: "Product deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = adminRouter;
