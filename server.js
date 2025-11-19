// ✅ 1️⃣ Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// ✅ 2️⃣ Import your centralized DB connection
const connectDB = require('./config/database'); // <-- 🔥 NEW: centralized MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 3️⃣ Connect to MongoDB before starting server
(async () => {
  await connectDB(); // <-- 🔥 NEW: only connect once using shared pool
})();

// ✅ 4️⃣ Security & performance middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression()); // ✅ Response compression for faster data transfer

// ✅ 5️⃣ Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ✅ 6️⃣ CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:5003",
      "https://shreegraphicsdesign-frontend.vercel.app",
      "https://shreegraphicsdesign.com",
      "https://www.shreegraphicsdesign.com",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ 7️⃣ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/custom-logo-designs", require("./routes/customLogoDesigns"));
app.use("/api/custom-logo-requests", require("./routes/customLogoRequests"));
app.use("/api/custom-embroidery-requests", require("./routes/customEmbroideryRequests"));
app.use("/api/custom-design-orders", require("./routes/customDesignOrders"));
app.use('/api/contact', require('./routes/contact'));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/admin/analytics", require("./routes/analytics"));
app.use("/api", require("./routes/reviewRoutes"));

// ✅ 8️⃣ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Shree Graphics Design API is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ 9️⃣ Global Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// ✅ 🔟 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ 11️⃣ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Backend API available at: http://localhost:${PORT}`);
});
