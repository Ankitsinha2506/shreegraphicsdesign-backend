const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const CustomLogoRequest = require("../models/CustomLogoRequest");
const CustomEmbroideryRequest = require("../models/CustomEmbroideryRequest");
const CustomDesignOrder = require("../models/CustomDesignOrder");

exports.getAnalyticsData = async (req, res) => {
  try {
    // ===========================
    // 📌 1. DAILY ORDERS
    // ===========================
    const ordersDaily = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===========================
    // 📌 2. DAILY REVENUE
    // ===========================
    const revenueDaily = await Order.aggregate([
      {
        $project: {
          createdAt: 1,
          total: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "i",
                    in: { $multiply: ["$$i.price", "$$i.quantity"] }
                  }
                }
              },
              "$taxAmount",
              "$shippingCost"
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===========================
    // 📌 3. DAILY USERS
    // ===========================
    const usersDaily = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===========================
    // 📌 4. MONTHLY REVENUE
    // ===========================
    const revenueMonthly = await Order.aggregate([
      {
        $project: {
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          total: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "i",
                    in: { $multiply: ["$$i.price", "$$i.quantity"] }
                  }
                }
              },
              "$taxAmount",
              "$shippingCost"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$yearMonth",
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===========================
    // 📌 5. ORDER STATUS COUNT
    // ===========================
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // ===========================
    // 📌 6. PRODUCT CATEGORY STATS
    // ===========================
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    // ===========================
    // 📌 7. TOP SELLING PRODUCTS
    // ===========================
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          sold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ]);

    // ===========================
    // 📌 8. LOGO & EMBROIDERY REQUESTS STATS
    // ===========================
    const logoStats = await CustomLogoRequest.countDocuments();
    const embroideryStats = await CustomEmbroideryRequest.countDocuments();

    // ===========================
    // 📌 9. CUSTOM DESIGN ORDERS STATS
    // ===========================
    const customDesignStats = await CustomDesignOrder.countDocuments();

    // ===========================
    // 📌 10. TOTALS
    // ===========================
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      {
        $project: {
          total: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "i",
                    in: { $multiply: ["$$i.price", "$$i.quantity"] }
                  }
                }
              },
              "$taxAmount",
              "$shippingCost"
            ]
          }
        }
      },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // ===========================
    // 📌 FINAL RESPONSE
    // ===========================
    return res.json({
      success: true,
      charts: {
        ordersDaily,
        revenueDaily,
        usersDaily,
        revenueMonthly
      },
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        orderStatusStats,
        productCategories,
        topProducts,
        logoStats,
        embroideryStats,
        customDesignStats
      }
    });

  } catch (error) {
    console.log("Analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load analytics"
    });
  }
};
