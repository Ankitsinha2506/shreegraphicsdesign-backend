const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Modern Business Logo Design',
    description: 'Professional modern logo design perfect for businesses. Clean lines, modern typography, and versatile color schemes that work across all media platforms.',
    category: 'logo-design',
    subcategory: 'business',
    price: {
      base: 799,
      premium: 1299,
      enterprise: 1999
    },
    images: [
      {
        url: '/api/placeholder/600/600',
        alt: 'Modern Business Logo Design',
        isPrimary: true
      },
      {
        url: '/api/placeholder/600/600',
        alt: 'Logo Variations',
        isPrimary: false
      }
    ],
    tags: ['modern', 'business', 'professional', 'clean'],
    features: {
      base: [
        'High-resolution PNG & JPG files',
        'Vector SVG format',
        '2 initial concepts',
        '2 revisions included',
        'Commercial usage rights'
      ],
      premium: [
        'All base features',
        '4 initial concepts',
        '5 revisions included',
        'Multiple color variations',
        'Business card design included',
        'Social media kit'
      ],
      enterprise: [
        'All premium features',
        'Unlimited revisions',
        'Complete brand identity package',
        'Letterhead design',
        'Brand guidelines document',
        'Priority support'
      ]
    },
    customizationOptions: [
      {
        name: 'Color Scheme',
        type: 'color',
        options: [
          { label: 'Blue & White', value: 'blue-white', additionalCost: 0 },
          { label: 'Red & Black', value: 'red-black', additionalCost: 0 },
          { label: 'Green & Gold', value: 'green-gold', additionalCost: 100 },
          { label: 'Custom Colors', value: 'custom', additionalCost: 200 }
        ],
        required: true
      },
      {
        name: 'Style',
        type: 'style',
        options: [
          { label: 'Minimalist', value: 'minimalist', additionalCost: 0 },
          { label: 'Corporate', value: 'corporate', additionalCost: 0 },
          { label: 'Creative', value: 'creative', additionalCost: 150 }
        ],
        required: true
      }
    ],
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    revisions: {
      base: 2,
      premium: 5,
      enterprise: -1
    },
    rating: {
      average: 4.8,
      count: 24
    },
    isActive: true,
    isFeatured: true,
    seoTitle: 'Modern Business Logo Design - Professional & Clean',
    seoDescription: 'Get a professional modern business logo design with clean lines and versatile color schemes. Perfect for startups and established businesses.'
  },
  {
    name: 'Creative Embroidery Design',
    description: 'Custom embroidery designs for apparel, accessories, and promotional items. High-quality digitized files ready for production.',
    category: 'other',
    subcategory: 'embroidery',
    price: {
      base: 599,
      premium: 999,
      enterprise: 1499
    },
    images: [
      {
        url: '/api/placeholder/600/600',
        alt: 'Creative Embroidery Design',
        isPrimary: true
      }
    ],
    tags: ['embroidery', 'custom', 'apparel', 'digitized'],
    features: {
      base: [
        'Digitized embroidery file',
        'Multiple format support',
        'Color chart included',
        'Basic design concept'
      ],
      premium: [
        'All base features',
        '3D mockup preview',
        'Multiple size variations',
        'Thread color recommendations',
        'Production guidelines'
      ],
      enterprise: [
        'All premium features',
        'Complete production package',
        'Bulk order discounts',
        'Quality assurance support'
      ]
    },
    customizationOptions: [
      {
        name: 'Size',
        type: 'size',
        options: [
          { label: 'Small (2-3 inches)', value: 'small', additionalCost: 0 },
          { label: 'Medium (4-5 inches)', value: 'medium', additionalCost: 100 },
          { label: 'Large (6+ inches)', value: 'large', additionalCost: 200 }
        ],
        required: true
      }
    ],
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    revisions: {
      base: 2,
      premium: 4,
      enterprise: -1
    },
    rating: {
      average: 4.6,
      count: 18
    },
    isActive: true,
    isFeatured: false,
    seoTitle: 'Custom Embroidery Design - Professional Digitizing',
    seoDescription: 'Professional custom embroidery designs with high-quality digitized files. Perfect for apparel, accessories, and promotional items.'
  },
  {
    name: 'Business Card Design',
    description: 'Professional business card designs that make a lasting impression. Modern layouts with your brand identity.',
    category: 'business-card',
    price: {
      base: 399,
      premium: 699,
      enterprise: 999
    },
    images: [
      {
        url: '/api/placeholder/600/600',
        alt: 'Business Card Design',
        isPrimary: true
      }
    ],
    tags: ['business-card', 'professional', 'print-ready'],
    features: {
      base: [
        'Double-sided design',
        'Print-ready files',
        'Standard size (3.5x2 inches)',
        '2 design concepts'
      ],
      premium: [
        'All base features',
        'Premium finishes options',
        '4 design concepts',
        'QR code integration',
        'Social media icons'
      ],
      enterprise: [
        'All premium features',
        'Multiple variations',
        'Spot UV recommendations',
        'Foil stamping options',
        'Complete stationery set'
      ]
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 2
    },
    revisions: {
      base: 2,
      premium: 4,
      enterprise: -1
    },
    rating: {
      average: 4.7,
      count: 32
    },
    isActive: true,
    isFeatured: true,
    seoTitle: 'Professional Business Card Design - Print Ready',
    seoDescription: 'Get professional business card designs that make a lasting impression. Modern layouts with your brand identity included.'
  },
  {
    name: 'Marketing Brochure Design',
    description: 'Eye-catching brochure designs for marketing campaigns. Tri-fold, bi-fold, and custom layouts available.',
    category: 'brochure',
    price: {
      base: 899,
      premium: 1399,
      enterprise: 1999
    },
    images: [
      {
        url: '/api/placeholder/600/600',
        alt: 'Marketing Brochure Design',
        isPrimary: true
      }
    ],
    tags: ['brochure', 'marketing', 'tri-fold', 'print'],
    features: {
      base: [
        'Tri-fold brochure design',
        'Print-ready files',
        'Stock photo suggestions',
        '2 design concepts'
      ],
      premium: [
        'All base features',
        'Multiple layout options',
        'Custom illustrations',
        'Infographic elements',
        'Digital version included'
      ],
      enterprise: [
        'All premium features',
        'Complete marketing suite',
        'Multiple size variations',
        'Interactive PDF version',
        'Marketing strategy consultation'
      ]
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    revisions: {
      base: 3,
      premium: 5,
      enterprise: -1
    },
    rating: {
      average: 4.5,
      count: 15
    },
    isActive: true,
    isFeatured: false,
    seoTitle: 'Marketing Brochure Design - Professional & Eye-catching',
    seoDescription: 'Professional marketing brochure designs for effective campaigns. Tri-fold, bi-fold, and custom layouts available.'
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@shreegraphics.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('Created default admin user');
    }
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add createdBy field to each product
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(productsWithCreator);
    console.log(`Inserted ${insertedProducts.length} sample products`);
    
    console.log('Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();