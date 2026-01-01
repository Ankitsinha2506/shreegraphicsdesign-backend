// ✅ 1️⃣ Import required packages
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// ✅ 2️⃣ Import centralized DB connection
const connectDB = require("./config/database"); // 🔥 path changed for /api folder

const app = express();

/* ✅ 3️⃣ Connect DB safely (serverless compatible) */
app.use(async (req, res, next) => {
  try {
    await connectDB(); // cached after first request
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ 4️⃣ Security & performance middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

// ✅ 5️⃣ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
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

/* ❌ REMOVE uploads static (Vercel FS is read-only) */
/* app.use('/uploads', express.static(...)) */

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
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin/analytics", require("./routes/analytics"));
app.use("/api/podcasts", require("./routes/podcasts"));
app.use("/api", require("./routes/reviewRoutes"));

// ✅ 8️⃣ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Shree Graphics Design API is running",
    time: new Date().toISOString(),
  });
});

// ✅ 8️⃣ Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Shree Graphics Design API is running",
    time: new Date().toISOString(),
  });
});

// ✅ 9️⃣ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// ✅ 🔟 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ✅ 11️⃣ EXPORT APP (NO listen) */
module.exports = app;

const PORT = process.env.PORT || 5003;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
