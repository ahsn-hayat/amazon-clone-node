const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // const authHeader = req.header("Authorization");
    // if (!authHeader || !authHeader.startsWith("Bearer "))
    //   return res.status(401).json({ msg: "No auth token, access denied!" });

    // const token = authHeader.substring(7);

    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied!" });

    const verified = jwt.verify(token, "myPassword");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied!" });

    const user = await User.findById(verified.id);

    if (!user) return res.status(401).json({ msg: "User not found" });

    if (user.type != "user")
      return res.status(401).json({ msg: "User can not perform this action." });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (e) {
    console.log(e.log);
    return res.status(500).json({ error: e.message });
  }
};

module.exports = auth;
