const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for admin creation');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@shreegraphics.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create new admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@shreegraphics.com',
      password: 'admin123456',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@shreegraphics.com');
    console.log('Password: admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();