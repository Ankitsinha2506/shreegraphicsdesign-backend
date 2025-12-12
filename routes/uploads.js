/**
 * ---------------------------------------------------------
 *  SHREE GRAPHICS DESIGN – FULL UPLOAD MODULE
 *  Supports:
 *  ✔ Avatar upload (local)
 *  ✔ Product image upload (local)
 *  ✔ Order screenshot upload (Cloudinary)
 *  ✔ Order documents (local)
 *  ✔ File deletion
 *  ✔ File info fetch
 *  ✔ Upload stats (admin)
 * ---------------------------------------------------------
 */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinaryConfig");

const { protect, authorize } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

/* ---------------------------------------------------------
   1️⃣ Cloudinary Configuration
--------------------------------------------------------- */
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

/* ---------------------------------------------------------
   2️⃣ Ensure Local Upload Folders Exist
--------------------------------------------------------- */
const uploadDirs = [
  "uploads/avatars",
  "uploads/products",
  "uploads/orders",
  "uploads/temp"
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ---------------------------------------------------------
   3️⃣ Multer Config Generator (Local Storage)
--------------------------------------------------------- */
const createMulterConfig = (destination, fileFilter) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, destination),
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueName + ext);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
  });

/* ---------------------------------------------------------
   4️⃣ File Filters
--------------------------------------------------------- */
const imageFilter = (req, file, cb) => {
  const types = /jpeg|jpg|png|gif|webp|svg/;
  const valid = types.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error("Only image files are allowed"));
};

const orderFileFilter = (req, file, cb) => {
  const imgTypes = /jpeg|jpg|png|gif|webp|svg/;
  const docTypes = /pdf|doc|docx|txt|zip|rar/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (imgTypes.test(ext) || docTypes.test(ext)) cb(null, true);
  else cb(new Error("Only image or document files allowed"));
};

/* ---------------------------------------------------------
   5️⃣ Multer Upload Handlers
--------------------------------------------------------- */
const uploadAvatar = createMulterConfig("uploads/avatars", imageFilter);

// ---------------------------------------------------------
// 🔥🔥 PRODUCT STORAGE UPDATED (Cloudinary Storage)
// BEFORE:
// const uploadProduct = createMulterConfig("uploads/products", imageFilter);
// AFTER:
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProduct = multer({ storage: productStorage });
// ---------------------------------------------------------

const uploadOrderFiles = createMulterConfig("uploads/orders", orderFileFilter);
const uploadTemp = multer({ dest: "uploads/temp" });

/* ---------------------------------------------------------
   6️⃣ Avatar Upload (Local)
--------------------------------------------------------- */
router.post("/avatar", protect, (req, res) => {
  const upload = uploadAvatar.single("avatar");

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    return res.json({
      success: true,
      message: "Avatar uploaded successfully",
      file: {
        filename: req.file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`,
      },
    });
  });
});

/* ---------------------------------------------------------
   7️⃣ Product Image Upload (NOW CLOUDINARY)
--------------------------------------------------------- */
router.post("/product", protect, authorize("admin"), (req, res) => {
  const upload = uploadProduct.array("images", 5);

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    if (!req.files?.length)
      return res.status(400).json({ success: false, message: "No files uploaded" });

    // ---------------------------------------------------------
    // 🔥🔥 URL UPDATED (Cloudinary)
    // BEFORE:
    // url: `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`,
    // AFTER:
    const files = req.files.map((file) => ({
      filename: file.filename,
      url: file.path, // Cloudinary secure URL
    }));
    // ---------------------------------------------------------

    return res.json({
      success: true,
      message: `${files.length} product images uploaded successfully`,
      files,
    });
  });
});

/* ---------------------------------------------------------
   8️⃣ ORDER SCREENSHOT (Cloudinary)
--------------------------------------------------------- */
router.post(
  "/order-screenshot",
  protect,
  uploadTemp.single("screenshot"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ success: false, message: "No screenshot uploaded" });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "orders/screenshots",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      fs.unlinkSync(req.file.path);

      return res.json({
        success: true,
        message: "Screenshot uploaded",
        url: result.secure_url,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   9️⃣ ORDER DOCUMENTS (Local)
--------------------------------------------------------- */
router.post("/order/:orderId", protect, (req, res) => {
  const upload = uploadOrderFiles.array("files", 10);

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    if (!req.files?.length)
      return res.status(400).json({ success: false, message: "No files uploaded" });

    const files = req.files.map((file) => ({
      filename: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/orders/${file.filename}`,
      type: file.mimetype,
      orderId: req.params.orderId,
    }));

    return res.json({
      success: true,
      message: `${files.length} order files uploaded`,
      files,
    });
  });
});

/* ---------------------------------------------------------
   🔟 Delete File
--------------------------------------------------------- */
router.delete("/:type/:filename", protect, async (req, res) => {
  try {
    const { type, filename } = req.params;

    if (!["avatars", "products", "orders"].includes(type))
      return res.status(400).json({ success: false, message: "Invalid type" });

    const filePath = path.join("uploads", type, filename);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ success: false, message: "File not found" });

    fs.unlinkSync(filePath);

    return res.json({ success: true, message: "File deleted" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
});

/* ---------------------------------------------------------
   1️⃣1️⃣ Get File Info
--------------------------------------------------------- */
router.get("/:type/:filename", (req, res) => {
  const { type, filename } = req.params;

  const filePath = path.join("uploads", type, filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ success: false, message: "File not found" });

  const stats = fs.statSync(filePath);

  return res.json({
    success: true,
    file: {
      filename,
      size: stats.size,
      created: stats.birthtime,
      url: `${req.protocol}://${req.get("host")}/uploads/${type}/${filename}`,
    },
  });
});

/* ---------------------------------------------------------
   1️⃣2️⃣ Upload Stats
--------------------------------------------------------- */
router.get("/admin/stats", protect, authorize("admin"), (req, res) => {
  const stats = {};

  ["avatars", "products", "orders"].forEach((type) => {
    const dir = path.join("uploads", type);
    let total = 0;
    let count = 0;

    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      count = files.length;
      files.forEach((f) => (total += fs.statSync(path.join(dir, f)).size));
    }

    stats[type] = {
      count,
      totalSizeMB: Math.round((total / (1024 * 1024)) * 100) / 100,
    };
  });

  return res.json({ success: true, stats });
});

module.exports = router;
