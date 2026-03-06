const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middlewares");
const User = require("../modules/user.modules");
const Product = require("../modules/products.modules");
const Order = require("../modules/order.modules");

router.use(protect, adminOnly);

router.get("/stats", async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders   = await Order.countDocuments();
    const orders        = await Order.find();
    const totalRevenue  = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0); // ✅ totalAmount
    const recentOrders  = await Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email");
    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders });
  } catch (err) { res.status(500).json({ message: "Stats failed", error: err.message }); }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("userId", "name email");
    res.json(orders);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ message: "Failed", error: err.message }); }
});

module.exports = router;