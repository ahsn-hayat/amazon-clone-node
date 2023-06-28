const express = require("express");
const auth = require("../middlewares/auth");
const Product = require("../models/product");
const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res) => {
  try {
    const { category, keyword } = req.query;
    const query = Object.assign(
      {},
      category && { category },
      keyword && {
        title: {
          $regex: new RegExp(keyword, "i"),
        },
      }
    );

    const products = await Product.find(query)
      .populate("supplier", "name email")
      .populate({
        path: "ratings.user",
        select: "name, email",
      });
    return res.json({ products: products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

productRouter.get("/api/products/search/:keyword", auth, async (req, res) => {
  try {
    const { keyword } = req.params;
    const query = Object.assign(
      {},
      keyword && {
        title: {
          $regex: new RegExp(keyword, "i"),
        },
      }
    );

    const products = await Product.find(query).populate(
      "supplier",
      "name email"
    );
    return res.json({ products: products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

productRouter.post("/api/product/rateProduct", auth, async (req, res) => {
  try {
    const { productId, rating } = req.body;

    let product = await Product.findById(productId);

    if (!product) return res.status(400).json({ msg: "Product not found!" });

    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId.toString() === req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }

    const ratingSchema = {
      user: req.user,
      rating: rating,
    };

    product.ratings.push(ratingSchema);

    await product.save();

    return res.json({ msg: "Rating added successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;
