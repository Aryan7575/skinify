const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controllers");

const { protect, adminOnly } = require("../middlewares/auth.middlewares");

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;