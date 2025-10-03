const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const categoryProducts = [
  // Logo Design Products (4 items)
  {
    name: "Premium Logo Design Package",
    category: "logo-design",
    description: "Professional logo design with multiple concepts, unlimited revisions, and complete brand guidelines. Perfect for startups and established businesses looking for a distinctive brand identity.",
    price: {
      base: 2999,
      premium: 4999,
      enterprise: 7999
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Premium Logo Design Package",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Logo Design Concepts"
      }
    ],
    features: {
      base: ["3 logo concepts", "2 revisions", "High-res files", "Basic guidelines"],
      premium: ["5 logo concepts", "5 revisions", "Vector files", "Brand guidelines", "Social media kit"],
      enterprise: ["Unlimited concepts", "Unlimited revisions", "Complete file package", "Comprehensive guidelines", "Brand consultation", "Trademark support"]
    },
    customizationOptions: [
      {
        name: "Style",
        type: "style",
        options: [
          { label: "Modern", value: "modern" },
          { label: "Classic", value: "classic" },
          { label: "Minimalist", value: "minimalist" },
          { label: "Vintage", value: "vintage" }
        ],
        required: true
      }
    ],
    tags: ["logo", "branding", "design", "professional", "business"]
  },
  {
    name: "Startup Logo Design",
    category: "logo-design",
    description: "Affordable logo design solution for startups and small businesses. Get a professional logo that represents your brand vision and helps you stand out in the market.",
    price: {
      base: 1499,
      premium: 2499,
      enterprise: 3999
    },
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Startup Logo Design",
        isPrimary: true
      }
    ],
    features: {
      base: ["2 logo concepts", "1 revision", "PNG files", "Basic usage rights"],
      premium: ["3 logo concepts", "3 revisions", "Vector files", "Usage guidelines"],
      enterprise: ["5 logo concepts", "Unlimited revisions", "Complete file package", "Brand guidelines"]
    },
    tags: ["startup", "logo", "affordable", "small-business", "branding"]
  },
  {
    name: "Corporate Logo Redesign",
    category: "logo-design",
    description: "Professional logo redesign service for established companies looking to refresh their brand identity. Maintain brand recognition while modernizing your visual presence.",
    price: {
      base: 3999,
      premium: 6999,
      enterprise: 9999
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Corporate Logo Redesign",
        isPrimary: true
      }
    ],
    features: {
      base: ["Brand analysis", "3 redesign concepts", "3 revisions", "Vector files"],
      premium: ["Comprehensive analysis", "5 redesign concepts", "5 revisions", "Brand guidelines", "Transition plan"],
      enterprise: ["Full brand audit", "Unlimited concepts", "Unlimited revisions", "Complete rebrand package", "Implementation support"]
    },
    tags: ["corporate", "redesign", "rebrand", "professional", "established"]
  },
  {
    name: "Logo Animation Package",
    category: "logo-design",
    description: "Bring your logo to life with professional animation. Perfect for digital marketing, video content, and modern brand presentations. Includes multiple animation styles.",
    price: {
      base: 4999,
      premium: 7999,
      enterprise: 12999
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Logo Animation Package",
        isPrimary: true
      }
    ],
    features: {
      base: ["2 animation styles", "HD video files", "3 revisions", "Basic formats"],
      premium: ["4 animation styles", "4K video files", "5 revisions", "Multiple formats", "Sound effects"],
      enterprise: ["Unlimited styles", "Custom animations", "Unlimited revisions", "All formats", "Custom sound design", "3D animations"]
    },
    tags: ["animation", "logo", "video", "digital", "modern"]
  },

  // Embroidery Products (4 items)
  {
    name: "Custom Embroidery Design",
    category: "embroidery",
    description: "Professional custom embroidery design service for apparel, accessories, and promotional items. High-quality digitization and expert craftsmanship for lasting results.",
    price: {
      base: 1999,
      premium: 3499,
      enterprise: 5999
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Custom Embroidery Design",
        isPrimary: true
      }
    ],
    features: {
      base: ["Basic digitization", "Single design", "Standard thread colors", "2 revisions"],
      premium: ["Advanced digitization", "Multiple sizes", "Premium thread colors", "5 revisions", "3D puff option"],
      enterprise: ["Expert digitization", "Unlimited sizes", "Metallic threads", "Unlimited revisions", "Special effects", "Rush delivery"]
    },
    customizationOptions: [
      {
        name: "Thread Color",
        type: "color",
        options: [
          { label: "Black", value: "black" },
          { label: "White", value: "white" },
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
          { label: "Gold", value: "gold", additionalCost: 200 }
        ],
        required: true
      }
    ],
    tags: ["embroidery", "custom", "apparel", "digitization", "professional"]
  },
  {
    name: "Corporate Uniform Embroidery",
    category: "embroidery",
    description: "Professional embroidery service for corporate uniforms and workwear. Consistent quality and branding across all garments with bulk order discounts available.",
    price: {
      base: 299,
      premium: 499,
      enterprise: 799
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Corporate Uniform Embroidery",
        isPrimary: true
      }
    ],
    features: {
      base: ["Logo embroidery", "Standard placement", "Basic thread colors", "Bulk pricing"],
      premium: ["Logo + text", "Multiple placements", "Premium threads", "Color matching", "Quality guarantee"],
      enterprise: ["Complex designs", "Custom placements", "Specialty threads", "Perfect color match", "Premium guarantee", "Rush service"]
    },
    tags: ["corporate", "uniform", "workwear", "bulk", "professional"]
  },
  {
    name: "Sports Team Embroidery",
    category: "embroidery",
    description: "High-quality embroidery for sports teams, clubs, and athletic organizations. Durable designs that withstand frequent washing and intense activities.",
    price: {
      base: 399,
      premium: 699,
      enterprise: 999
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Sports Team Embroidery",
        isPrimary: true
      }
    ],
    features: {
      base: ["Team logo", "Player numbers", "Standard colors", "Durable threads"],
      premium: ["Logo + mascot", "Names + numbers", "Team colors", "Reinforced stitching", "Moisture-wicking compatible"],
      enterprise: ["Complex designs", "Full customization", "Exact color match", "Premium durability", "Performance fabric ready", "Championship quality"]
    },
    tags: ["sports", "team", "athletic", "durable", "custom"]
  },
  {
    name: "Luxury Embroidery Service",
    category: "embroidery",
    description: "Premium embroidery service for luxury brands, high-end fashion, and exclusive products. Finest materials and expert craftsmanship for exceptional results.",
    price: {
      base: 2999,
      premium: 4999,
      enterprise: 7999
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Luxury Embroidery Service",
        isPrimary: true
      }
    ],
    features: {
      base: ["Premium threads", "Hand-finished details", "Luxury packaging", "Quality certificate"],
      premium: ["Silk threads", "Gold accents", "Custom packaging", "Authenticity guarantee", "White-glove service"],
      enterprise: ["Finest materials", "Precious metal threads", "Bespoke packaging", "Lifetime guarantee", "Concierge service", "Museum quality"]
    },
    tags: ["luxury", "premium", "high-end", "exclusive", "finest"]
  },

  // Branding Products (4 items)
  {
    name: "Complete Brand Identity Package",
    category: "other",
    subcategory: "branding",
    description: "Comprehensive brand identity solution including logo, color palette, typography, guidelines, and marketing materials. Everything you need to establish a strong brand presence.",
    price: {
      base: 9999,
      premium: 19999,
      enterprise: 39999
    },
    deliveryTime: {
      base: 21,
      premium: 14,
      enterprise: 10
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Complete Brand Identity Package",
        isPrimary: true
      }
    ],
    features: {
      base: ["Logo design", "Color palette", "Typography", "Basic guidelines", "Business cards"],
      premium: ["Premium logo", "Extended palette", "Custom fonts", "Detailed guidelines", "Stationery suite", "Social media kit"],
      enterprise: ["Luxury branding", "Complete palette", "Exclusive typography", "Comprehensive guidelines", "Full marketing suite", "Brand consultation", "Implementation support"]
    },
    tags: ["branding", "identity", "complete", "professional", "comprehensive"]
  },
  {
    name: "Brand Strategy & Positioning",
    category: "other",
    subcategory: "branding",
    description: "Strategic brand development service including market research, positioning, messaging, and brand architecture. Build a strong foundation for your brand's success.",
    price: {
      base: 14999,
      premium: 24999,
      enterprise: 49999
    },
    deliveryTime: {
      base: 28,
      premium: 21,
      enterprise: 14
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Brand Strategy & Positioning",
        isPrimary: true
      }
    ],
    features: {
      base: ["Market research", "Brand positioning", "Core messaging", "Strategy document"],
      premium: ["Comprehensive research", "Competitive analysis", "Brand architecture", "Messaging framework", "Implementation roadmap"],
      enterprise: ["Deep market insights", "Full competitive audit", "Complete brand system", "Strategic framework", "Detailed roadmap", "Ongoing consultation"]
    },
    tags: ["strategy", "positioning", "research", "consulting", "foundation"]
  },
  {
    name: "Brand Refresh & Modernization",
    category: "other",
    subcategory: "branding",
    description: "Modernize your existing brand while maintaining equity and recognition. Perfect for established businesses looking to stay relevant and competitive.",
    price: {
      base: 7999,
      premium: 14999,
      enterprise: 24999
    },
    deliveryTime: {
      base: 18,
      premium: 12,
      enterprise: 8
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Brand Refresh & Modernization",
        isPrimary: true
      }
    ],
    features: {
      base: ["Brand audit", "Logo refresh", "Updated guidelines", "Transition plan"],
      premium: ["Comprehensive audit", "Complete refresh", "Detailed guidelines", "Implementation support", "Staff training"],
      enterprise: ["Full brand analysis", "Strategic refresh", "Complete system update", "Full implementation", "Team training", "Ongoing support"]
    },
    tags: ["refresh", "modernization", "update", "evolution", "contemporary"]
  },
  {
    name: "Digital Brand Experience",
    category: "other",
    subcategory: "branding",
    description: "Create cohesive digital brand experiences across all touchpoints. Includes website design, social media templates, and digital marketing materials.",
    price: {
      base: 12999,
      premium: 22999,
      enterprise: 39999
    },
    deliveryTime: {
      base: 25,
      premium: 18,
      enterprise: 12
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Digital Brand Experience",
        isPrimary: true
      }
    ],
    features: {
      base: ["Website design", "Social templates", "Email templates", "Digital guidelines"],
      premium: ["Responsive website", "Complete social kit", "Marketing templates", "Interactive guidelines", "Mobile optimization"],
      enterprise: ["Custom web platform", "Full digital ecosystem", "Advanced templates", "Interactive brand guide", "Multi-platform optimization", "Performance analytics"]
    },
    tags: ["digital", "experience", "website", "social", "online"]
  }
];

const seedCategoryProducts = async () => {
  try {
    await connectDB();
    
    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@shreegraphics.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('Created default admin user');
    }
    
    // Add createdBy field to each product
    const productsWithCreator = categoryProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      rating: {
        average: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
        count: Math.floor(Math.random() * 50) + 10 // Random count between 10-60
      },
      isActive: true,
      isFeatured: Math.random() > 0.5 // Random featured status
    }));
    
    // Insert category products
    const insertedProducts = await Product.insertMany(productsWithCreator);
    console.log(`Inserted ${insertedProducts.length} category products`);
    
    console.log('Category products seeding completed successfully!');
    console.log('Products added:');
    console.log('- Logo Design: 4 products');
    console.log('- Embroidery: 4 products');
    console.log('- Branding: 4 products');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding category products:', error);
    process.exit(1);
  }
};

seedCategoryProducts();