const Order = require("../modules/order.modules");
const Product = require("../modules/products.modules");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    let totalAmount = 0;

    // Calculate total & check stock
    for (let item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      totalAmount += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN – GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN – UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};