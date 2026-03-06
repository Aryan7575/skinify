const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/products.controller");

const { protect, adminOnly } = require("../middlewares/auth.middlewares");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;