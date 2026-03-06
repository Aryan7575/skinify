const express = require('express')
const authRoutes = require('./routes/auth.routes')
const app = express();
const cors = require('cors')
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/order.routes");
const aiRoutes = require('./routes/ai')
const imagekitRoutes = require("./routes/imagekit.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ removed app.options("*", cors()) - not compatible with your Express version

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/imagekit", imagekitRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.send("Ai skincare backend running")
});

module.exports = app;