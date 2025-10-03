require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/database');

const seed200Products = async () => {
  try {
    await connectDB();

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@shreegraphics.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@shreegraphics.com',
        password: 'hashedpassword',
        role: 'admin'
      });
      await adminUser.save();
    }

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    const products = [
      // APPARELS - Caps (20 products)
      {
        name: 'Custom Baseball Cap - Classic',
        description: 'High-quality cotton baseball cap with custom embroidery. Perfect for teams, events, and promotional use.',
        category: 'apparels',
        subcategory: 'cap',
        price: { base: 299, premium: 449, enterprise: 699 },
        images: [
          { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Baseball Cap', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500', alt: 'Cap Side View' }
        ],
        tags: ['cap', 'baseball', 'custom', 'embroidery', 'cotton'],
        features: {
          base: ['Cotton material', 'Adjustable strap', 'Basic embroidery'],
          premium: ['Premium cotton', 'Metal buckle', 'Multi-color embroidery', 'Logo placement'],
          enterprise: ['Organic cotton', 'Custom hardware', 'Full design freedom', 'Bulk pricing']
        },
        deliveryTime: { base: 5, premium: 4, enterprise: 3 },
        isFeatured: true,
        createdBy: null
      },
      {
        name: 'Snapback Cap - Urban Style',
        description: 'Modern snapback cap with flat brim design. Ideal for streetwear and casual branding.',
        category: 'apparels',
        subcategory: 'cap',
        price: { base: 399, premium: 599, enterprise: 899 },
        images: [
          { url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500', alt: 'Snapback Cap', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500', alt: 'Snapback Profile' }
        ],
        tags: ['snapback', 'urban', 'streetwear', 'flat-brim'],
        features: {
          base: ['Flat brim', 'Snapback closure', 'Basic logo'],
          premium: ['Structured crown', 'Premium materials', 'Custom colors'],
          enterprise: ['Designer collaboration', 'Limited edition', 'Premium packaging']
        },
        deliveryTime: { base: 6, premium: 5, enterprise: 4 },
        createdBy: null
      },
      {
        name: 'Trucker Cap - Mesh Back',
        description: 'Classic trucker cap with mesh back for breathability. Great for outdoor events and casual wear.',
        category: 'apparels',
        subcategory: 'cap',
        price: { base: 349, premium: 499, enterprise: 749 },
        images: [
          { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', alt: 'Trucker Cap', isPrimary: true }
        ],
        tags: ['trucker', 'mesh', 'breathable', 'outdoor'],
        features: {
          base: ['Mesh back', 'Foam front', 'Snapback closure'],
          premium: ['Premium mesh', 'Structured front', 'Custom patch'],
          enterprise: ['Designer mesh', 'Premium foam', 'Full customization']
        },
        deliveryTime: { base: 5, premium: 4, enterprise: 3 },
        createdBy: null
      },
      {
        name: 'Beanie Cap - Winter Collection',
        description: 'Warm knitted beanie perfect for winter branding and cold weather promotions.',
        category: 'apparels',
        subcategory: 'cap',
        price: { base: 249, premium: 399, enterprise: 599 },
        images: [
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Beanie Cap', isPrimary: true }
        ],
        tags: ['beanie', 'winter', 'knitted', 'warm'],
        features: {
          base: ['Acrylic knit', 'One size fits all', 'Basic embroidery'],
          premium: ['Wool blend', 'Fleece lining', 'Custom colors'],
          enterprise: ['Merino wool', 'Cashmere blend', 'Luxury packaging']
        },
        deliveryTime: { base: 7, premium: 6, enterprise: 5 },
        createdBy: null
      },
      {
        name: 'Bucket Hat - Festival Style',
        description: 'Trendy bucket hat perfect for festivals, outdoor events, and summer promotions.',
        category: 'apparels',
        subcategory: 'cap',
        price: { base: 329, premium: 479, enterprise: 699 },
        images: [
          { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', alt: 'Bucket Hat', isPrimary: true }
        ],
        tags: ['bucket', 'festival', 'summer', 'trendy'],
        features: {
          base: ['Cotton twill', 'Wide brim', 'Basic print'],
          premium: ['Canvas material', 'Reinforced brim', 'All-over print'],
          enterprise: ['Premium canvas', 'Custom lining', 'Designer prints']
        },
        deliveryTime: { base: 6, premium: 5, enterprise: 4 },
        createdBy: null
      }
    ];

    // Add more products for other categories
    const additionalProducts = [
      // APPARELS - Jackets (15 products)
      {
        name: 'Corporate Blazer - Executive',
        description: 'Professional blazer for corporate branding and executive wear.',
        category: 'apparels',
        subcategory: 'jackets',
        price: { base: 2999, premium: 4499, enterprise: 6999 },
        images: [
          { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', alt: 'Corporate Blazer', isPrimary: true }
        ],
        tags: ['blazer', 'corporate', 'executive', 'professional'],
        features: {
          base: ['Polyester blend', 'Standard fit', 'Basic lining'],
          premium: ['Wool blend', 'Tailored fit', 'Premium lining'],
          enterprise: ['Pure wool', 'Custom tailoring', 'Luxury details']
        },
        deliveryTime: { base: 14, premium: 12, enterprise: 10 },
        isFeatured: true,
        createdBy: null
      },
      {
        name: 'Windbreaker Jacket - Sports',
        description: 'Lightweight windbreaker perfect for sports teams and outdoor activities.',
        category: 'apparels',
        subcategory: 'jackets',
        price: { base: 1299, premium: 1899, enterprise: 2799 },
        images: [
          { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Windbreaker Jacket', isPrimary: true }
        ],
        tags: ['windbreaker', 'sports', 'lightweight', 'outdoor'],
        features: {
          base: ['Water resistant', 'Lightweight fabric', 'Basic logo'],
          premium: ['Waterproof', 'Breathable fabric', 'Reflective details'],
          enterprise: ['Premium waterproof', 'Advanced breathability', 'Custom design']
        },
        deliveryTime: { base: 10, premium: 8, enterprise: 6 },
        createdBy: null
      }
    ];

    // Continue with more categories...
    const moreProducts = [];

    // Generate products for all categories to reach 200+
    const categories = {
      'apparels': {
        'cap': 20,
        'jackets': 15,
        'sweatshirt': 15,
        'denim-shirt': 10,
        'windcheaters': 10
      },
      'travels': {
        'hand-bag': 15,
        'strolley-bags': 10,
        'travel-bags': 10,
        'back-packs': 15,
        'laptop-bags': 10
      },
      'leather': {
        'office-bags': 10,
        'wallets': 10
      },
      'uniforms': {
        'school-uniforms': 15,
        'corporate': 10
      },
      'design-services': {
        'logo-design': 20,
        'business-card': 10,
        'brochure': 8,
        'banner': 8,
        'poster': 8,
        'flyer': 6,
        'website-design': 10
      },
      'embroidery': {
        'logo-embroidery': 8,
        'text-embroidery': 6,
        'custom-patches': 6,
        'monogramming': 5,
        'applique': 5,
        'thread-work': 5,
        'beadwork': 4,
        'sequin-work': 4,
        'machine-embroidery': 4,
        'hand-embroidery': 3
      }
    };

    // Generate products programmatically
    for (const [category, subcategories] of Object.entries(categories)) {
      for (const [subcategory, count] of Object.entries(subcategories)) {
        for (let i = 1; i <= count; i++) {
          const product = {
            name: `${subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i}`,
            description: `Professional ${subcategory.replace('-', ' ')} service with custom design and high-quality materials. Perfect for businesses and personal use.`,
            category: category,
            subcategory: subcategory,
            price: {
              base: Math.floor(Math.random() * 2000) + 299,
              premium: Math.floor(Math.random() * 3000) + 1500,
              enterprise: Math.floor(Math.random() * 5000) + 3000
            },
            images: [{
              url: getImageForCategory(category, subcategory),
              alt: `${subcategory.replace('-', ' ')} ${i}`,
              isPrimary: true
            }],
            tags: subcategory.split('-').concat([category, 'custom', 'professional']),
            features: {
              base: ['High quality materials', 'Professional design', 'Fast delivery'],
              premium: ['Premium materials', 'Advanced design', 'Priority support'],
              enterprise: ['Luxury materials', 'Custom design', 'Dedicated support']
            },
            deliveryTime: {
              base: Math.floor(Math.random() * 10) + 5,
              premium: Math.floor(Math.random() * 8) + 3,
              enterprise: Math.floor(Math.random() * 5) + 2
            },
            isFeatured: Math.random() > 0.8,
            createdBy: null
          };
          moreProducts.push(product);
        }
      }
    }

    // Combine all products
    const allProducts = [...products, ...additionalProducts, ...moreProducts];

    // Add createdBy field to all products
    const productsWithCreator = allProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert products in batches
    console.log(`Inserting ${productsWithCreator.length} products...`);
    const insertedProducts = await Product.insertMany(productsWithCreator);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    console.log('Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Function to get appropriate image for category
function getImageForCategory(category, subcategory) {
  const imageMap = {
    'apparels': {
      'cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
      'jackets': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
      'sweatshirt': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      'denim-shirt': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      'windcheaters': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'
    },
    'travels': {
      'hand-bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'strolley-bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
      'travel-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'back-packs': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'laptop-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    },
    'leather': {
      'office-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'wallets': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
    },
    'uniforms': {
      'school-uniforms': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
      'corporate': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    },
    'design-services': {
      'logo-design': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500',
      'business-card': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'brochure': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'banner': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'poster': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'flyer': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'website-design': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500'
    },
    'embroidery': {
      'logo-embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'text-embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'custom-patches': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'monogramming': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'applique': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'thread-work': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'beadwork': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'sequin-work': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'machine-embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'hand-embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    }
  };

  return imageMap[category]?.[subcategory] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500';
}

seed200Products();