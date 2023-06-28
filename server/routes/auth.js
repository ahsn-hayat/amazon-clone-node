const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "This user already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      name,
      email,
      password: hashedPassword,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const isMatch = bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Password is not matched" });
    }

    const token = jwt.sign({ id: user._id }, "myPassword");
    res.json({ ...user._doc, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/validateToken", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) res.status(400).json(false);
    const verified = jwt.verify(token, "myPassword");
    if (!verified) res.status(400).json(false);

    const user = await User.findById(verified.id);
    if (!user) res.status(400).json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/auth/api/getData", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

module.exports = authRouter;
