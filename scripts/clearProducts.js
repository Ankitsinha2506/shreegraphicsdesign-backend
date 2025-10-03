const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const clearProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics');
    console.log('Connected to MongoDB');

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products from the database`);

    console.log('✅ All products cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
};

clearProducts();