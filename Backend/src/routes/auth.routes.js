const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.contoller");
const jwt = require("jsonwebtoken");
const User = require("../modules/user.modules")

router.post("/register", register);
router.post("/login", login);

// ✅ NEW ROUTE (appended only)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;