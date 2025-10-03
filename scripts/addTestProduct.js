const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const addTestProduct = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@shreegraphics.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Create test product
    const testProduct = {
      name: 'Professional Business Logo Design',
      description: 'Modern, clean logo design perfect for businesses. Includes multiple formats and unlimited revisions.',
      category: 'logo-design',
      subcategory: 'business',
      price: {
        base: 2999,
        premium: 4999,
        enterprise: 7999
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=600&fit=crop',
          alt: 'Professional business logo design sample',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&h=600&fit=crop',
          alt: 'Logo variations and mockups',
          isPrimary: false
        }
      ],
      tags: ['logo', 'business', 'professional', 'modern', 'branding'],
      features: {
        base: [
          'High-resolution PNG & JPG files',
          'Vector SVG format',
          '2 design concepts',
          '3 revisions included',
          'Commercial usage rights'
        ],
        premium: [
          'All base features',
          '5 design concepts',
          'Unlimited revisions',
          'Brand guidelines document',
          'Social media kit',
          'Business card template'
        ],
        enterprise: [
          'All premium features',
          'Complete brand identity package',
          'Letterhead & envelope design',
          'Website favicon',
          'Dedicated account manager',
          'Priority support'
        ]
      },
      customizationOptions: [
        {
          name: 'Style',
          type: 'style',
          options: [
            { label: 'Modern', value: 'modern' },
            { label: 'Classic', value: 'classic' },
            { label: 'Minimalist', value: 'minimalist' }
          ],
          required: true
        },
        {
          name: 'Color Scheme',
          type: 'color',
          options: [
            { label: 'Single Color', value: 'single' },
            { label: 'Two Colors', value: 'dual', additionalCost: 500 },
            { label: 'Full Color', value: 'full', additionalCost: 1000 }
          ],
          required: true
        }
      ],
      deliveryTime: {
        base: 5,
        premium: 3,
        enterprise: 2
      },
      seoTitle: 'Professional Business Logo Design Services',
      seoDescription: 'Get a professional business logo designed by experts. Multiple concepts, unlimited revisions, and commercial usage rights included.',
      createdBy: adminUser._id
    };

    // Check if product already exists
    const existingProduct = await Product.findOne({ name: testProduct.name });
    if (existingProduct) {
      console.log('Test product already exists with ID:', existingProduct._id);
      console.log('You can access it at: http://localhost:5173/products/' + existingProduct._id);
    } else {
      const product = await Product.create(testProduct);
      console.log('Test product created successfully!');
      console.log('Product ID:', product._id);
      console.log('You can access it at: http://localhost:5173/products/' + product._id);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addTestProduct();