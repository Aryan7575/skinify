const jwt = require("jsonwebtoken");

// ✅ Protect Route Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// ✅ Proper Export
module.exports = { protect, adminOnly };