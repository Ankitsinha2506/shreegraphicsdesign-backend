const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getAnalyticsData } = require("../controllers/adminAnalyticsController");

router.get("/", protect, authorize("admin"), getAnalyticsData);

module.exports = router;
