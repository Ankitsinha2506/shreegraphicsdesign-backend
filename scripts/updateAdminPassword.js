const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for password update');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const updateAdminPassword = async () => {
  try {
    await connectDB();
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@shreegraphics.com' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    // Update password - the pre-save middleware will hash it
    adminUser.password = 'admin123456';
    await adminUser.save();
    
    console.log('Admin password updated successfully to: admin123456');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
};

updateAdminPassword();