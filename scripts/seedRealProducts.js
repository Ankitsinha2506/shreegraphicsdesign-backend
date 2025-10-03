const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  // Cap Category
  {
    name: "Custom Embroidered Baseball Cap",
    category: "cap",
    description: "High-quality cotton baseball cap with custom embroidery. Perfect for corporate branding, team uniforms, or promotional events. Available in multiple colors with durable stitching.",
    price: {
      base: 299,
      premium: 449,
      enterprise: 599
    },
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Custom Embroidered Baseball Cap - Front View"
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Custom Embroidered Baseball Cap - Side View"
      }
    ],
    features: {
      base: ["Custom embroidery", "Cotton material", "Adjustable strap", "Standard colors"],
      premium: ["Premium embroidery", "High-grade cotton", "Metal buckle", "Extended color options", "Logo placement flexibility"],
      enterprise: ["3D embroidery", "Premium cotton blend", "Leather strap", "Custom color matching", "Multiple logo placements", "Bulk packaging"]
    },
    tags: ["cap", "embroidery", "corporate", "promotional", "custom"]
  },
  {
    name: "Snapback Cap with Logo Print",
    category: "cap",
    description: "Trendy snapback cap with high-quality logo printing. Ideal for streetwear brands, sports teams, and fashion-forward businesses. Flat brim design with premium materials.",
    price: {
      base: 349,
      premium: 499,
      enterprise: 649
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500",
        alt: "Snapback Cap with Logo Print"
      },
      {
        url: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500",
        alt: "Snapback Cap - Back View"
      }
    ],
    features: {
      base: ["Snapback closure", "Flat brim", "Logo print", "Cotton blend"],
      premium: ["Premium snapback", "Structured crown", "High-resolution print", "Moisture-wicking", "UV protection"],
      enterprise: ["Custom snapback design", "3D structured crown", "Sublimation print", "Performance fabric", "Custom packaging", "Brand tags"]
    },
    tags: ["snapback", "logo", "print", "streetwear", "fashion"]
  },
  {
    name: "Trucker Mesh Cap",
    category: "cap",
    description: "Classic trucker cap with mesh back for breathability. Perfect for outdoor brands, delivery services, and casual wear. Foam front panel ideal for logo application.",
    price: {
      base: 249,
      premium: 399,
      enterprise: 549
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500",
        alt: "Trucker Mesh Cap"
      },
      {
        url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
        alt: "Trucker Cap - Side Profile"
      }
    ],
    features: {
      base: ["Mesh back", "Foam front", "Snapback closure", "Standard colors"],
      premium: ["Premium mesh", "Structured foam", "Curved brim", "Comfort sweatband", "Custom colors"],
      enterprise: ["Performance mesh", "3D foam front", "Custom brim curve", "Moisture-wicking band", "Custom mesh colors", "Bulk options"]
    },
    tags: ["trucker", "mesh", "breathable", "outdoor", "casual"]
  },
  {
    name: "Beanie Winter Cap",
    category: "cap",
    description: "Warm and comfortable beanie cap perfect for winter promotions and cold weather branding. Soft acrylic material with excellent embroidery capabilities.",
    price: {
      base: 199,
      premium: 299,
      enterprise: 449
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Beanie Winter Cap"
      },
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
        alt: "Beanie Cap - Folded View"
      }
    ],
    features: {
      base: ["Acrylic material", "One size fits all", "Basic embroidery", "Standard colors"],
      premium: ["Premium acrylic blend", "Comfort fit", "Detailed embroidery", "Extended colors", "Cuff options"],
      enterprise: ["Merino wool blend", "Custom fit options", "3D embroidery", "Custom color matching", "Fleece lining", "Gift packaging"]
    },
    tags: ["beanie", "winter", "warm", "embroidery", "seasonal"]
  },

  // Jackets Category
  {
    name: "Corporate Windbreaker Jacket",
    category: "jackets",
    description: "Professional windbreaker jacket perfect for corporate events and outdoor activities. Water-resistant material with multiple customization options for logos and branding.",
    price: {
      base: 1299,
      premium: 1799,
      enterprise: 2299
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Corporate Windbreaker Jacket"
      },
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
        alt: "Windbreaker - Back View"
      }
    ],
    features: {
      base: ["Water-resistant", "Lightweight", "Basic logo placement", "Standard sizes"],
      premium: ["Waterproof coating", "Breathable fabric", "Multiple logo options", "Extended sizes", "Reflective elements"],
      enterprise: ["Premium waterproof", "Technical fabric", "Custom design", "All sizes available", "Safety features", "Custom packaging"]
    },
    tags: ["windbreaker", "corporate", "waterproof", "outdoor", "professional"]
  },
  {
    name: "Fleece Zip-Up Jacket",
    category: "jackets",
    description: "Comfortable fleece jacket with full zip closure. Ideal for team uniforms, corporate wear, and promotional events. Soft material perfect for embroidery and printing.",
    price: {
      base: 999,
      premium: 1399,
      enterprise: 1899
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Fleece Zip-Up Jacket"
      },
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
        alt: "Fleece Jacket - Zipped"
      }
    ],
    features: {
      base: ["Polar fleece", "Full zip", "Two pockets", "Standard colors"],
      premium: ["Anti-pill fleece", "YKK zipper", "Chest pocket", "Custom colors", "Contrast piping"],
      enterprise: ["Premium fleece blend", "Custom zipper pulls", "Multiple pockets", "Color matching", "Embroidered details", "Individual packaging"]
    },
    tags: ["fleece", "zip-up", "comfortable", "team", "uniform"]
  },
  {
    name: "Bomber Jacket Custom",
    category: "jackets",
    description: "Stylish bomber jacket with modern fit and premium materials. Perfect for fashion brands, music events, and trendy corporate wear. Multiple customization options available.",
    price: {
      base: 1599,
      premium: 2199,
      enterprise: 2899
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Bomber Jacket Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Bomber Jacket - Styled"
      }
    ],
    features: {
      base: ["Classic bomber fit", "Ribbed cuffs", "Basic customization", "Standard colors"],
      premium: ["Premium materials", "Custom lining", "Embroidered patches", "Extended colors", "Metal hardware"],
      enterprise: ["Luxury fabrics", "Fully custom design", "3D embroidery", "Custom hardware", "Branded labels", "Premium packaging"]
    },
    tags: ["bomber", "fashion", "trendy", "custom", "premium"]
  },
  {
    name: "Varsity Letterman Jacket",
    category: "jackets",
    description: "Classic varsity jacket with wool body and leather sleeves. Perfect for schools, sports teams, and retro-themed brands. Traditional styling with modern customization options.",
    price: {
      base: 2199,
      premium: 2899,
      enterprise: 3599
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
        alt: "Varsity Letterman Jacket"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Varsity Jacket - Back Design"
      }
    ],
    features: {
      base: ["Wool body", "Synthetic sleeves", "Basic lettering", "Standard colors"],
      premium: ["Premium wool", "Genuine leather sleeves", "Chenille patches", "Custom colors", "Embroidered details"],
      enterprise: ["Luxury wool blend", "Premium leather", "3D chenille", "Full customization", "Metal snaps", "Heritage packaging"]
    },
    tags: ["varsity", "letterman", "school", "sports", "classic"]
  },

  // Sweatshirt Category
  {
    name: "Pullover Hoodie Custom",
    category: "sweatshirt",
    description: "Comfortable pullover hoodie with kangaroo pocket and adjustable drawstring. Perfect for casual wear, team merchandise, and promotional events. Premium cotton blend for durability.",
    price: {
      base: 799,
      premium: 1199,
      enterprise: 1599
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Pullover Hoodie Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Hoodie - Hood Up"
      }
    ],
    features: {
      base: ["Cotton blend", "Kangaroo pocket", "Drawstring hood", "Standard colors"],
      premium: ["Premium cotton", "Lined hood", "Reinforced pocket", "Custom colors", "Contrast strings"],
      enterprise: ["Organic cotton blend", "Fleece-lined hood", "Hidden pocket", "Color matching", "Custom drawstrings", "Eco packaging"]
    },
    tags: ["hoodie", "pullover", "casual", "comfortable", "cotton"]
  },
  {
    name: "Zip-Up Hoodie Sweatshirt",
    category: "sweatshirt",
    description: "Versatile zip-up hoodie with full-length zipper and side pockets. Ideal for layering and corporate casual wear. Excellent surface for large logo applications.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Zip-Up Hoodie Sweatshirt"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Zip Hoodie - Open"
      }
    ],
    features: {
      base: ["Full zip closure", "Side pockets", "Ribbed cuffs", "Standard fit"],
      premium: ["YKK zipper", "Lined pockets", "Adjustable hem", "Athletic fit", "Moisture-wicking"],
      enterprise: ["Premium zipper", "Multiple pockets", "Custom fit", "Performance fabric", "Reflective details", "Tech features"]
    },
    tags: ["zip-up", "hoodie", "versatile", "layering", "corporate"]
  },
  {
    name: "Crewneck Sweatshirt",
    category: "sweatshirt",
    description: "Classic crewneck sweatshirt with ribbed collar and cuffs. Perfect for screen printing and embroidery. Comfortable fit suitable for all-day wear and promotional events.",
    price: {
      base: 699,
      premium: 999,
      enterprise: 1399
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Crewneck Sweatshirt"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Crewneck - Flat Lay"
      }
    ],
    features: {
      base: ["Ribbed collar", "Cotton blend", "Regular fit", "Basic colors"],
      premium: ["Reinforced collar", "Premium cotton", "Comfortable fit", "Extended colors", "Pre-shrunk"],
      enterprise: ["Luxury cotton blend", "Custom collar", "Tailored fit", "Custom colors", "Sustainable materials", "Premium finishing"]
    },
    tags: ["crewneck", "classic", "comfortable", "printing", "embroidery"]
  },
  {
    name: "Oversized Sweatshirt",
    category: "sweatshirt",
    description: "Trendy oversized sweatshirt with dropped shoulders and relaxed fit. Perfect for streetwear brands and fashion-forward companies. Modern silhouette with vintage comfort.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Oversized Sweatshirt"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Oversized Sweatshirt - Styled"
      }
    ],
    features: {
      base: ["Oversized fit", "Dropped shoulders", "Soft fabric", "Trendy colors"],
      premium: ["Premium oversized cut", "Structured shoulders", "Vintage wash", "Fashion colors", "Contrast details"],
      enterprise: ["Designer oversized fit", "Custom proportions", "Luxury fabric", "Exclusive colors", "Branded details", "Fashion packaging"]
    },
    tags: ["oversized", "trendy", "streetwear", "fashion", "relaxed"]
  },

  // Denim Shirt Category
  {
    name: "Classic Denim Work Shirt",
    category: "denim-shirt",
    description: "Durable denim work shirt with button-front closure and chest pockets. Perfect for industrial branding, casual corporate wear, and rugged outdoor companies. Premium denim construction.",
    price: {
      base: 1199,
      premium: 1699,
      enterprise: 2299
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Classic Denim Work Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Denim Shirt - Pocket Detail"
      }
    ],
    features: {
      base: ["100% cotton denim", "Button front", "Chest pockets", "Standard wash"],
      premium: ["Premium denim", "Pearl snap buttons", "Reinforced pockets", "Vintage wash", "Custom embroidery"],
      enterprise: ["Selvedge denim", "Custom hardware", "Multiple pockets", "Artisan wash", "Leather patches", "Heritage packaging"]
    },
    tags: ["denim", "work shirt", "durable", "industrial", "classic"]
  },
  {
    name: "Chambray Casual Shirt",
    category: "denim-shirt",
    description: "Lightweight chambray shirt with modern fit and soft texture. Ideal for business casual environments and contemporary branding. Comfortable alternative to traditional denim.",
    price: {
      base: 999,
      premium: 1399,
      enterprise: 1899
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Chambray Casual Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Chambray Shirt - Rolled Sleeves"
      }
    ],
    features: {
      base: ["Lightweight chambray", "Modern fit", "Button-down collar", "Basic colors"],
      premium: ["Premium chambray", "Tailored fit", "Mother-of-pearl buttons", "Extended colors", "Wrinkle-resistant"],
      enterprise: ["Luxury chambray", "Custom fit", "Designer buttons", "Exclusive colors", "Performance features", "Garment care"]
    },
    tags: ["chambray", "casual", "lightweight", "business", "modern"]
  },
  {
    name: "Distressed Denim Shirt",
    category: "denim-shirt",
    description: "Trendy distressed denim shirt with vintage appeal and contemporary styling. Perfect for fashion brands, music industry, and creative companies seeking edgy promotional wear.",
    price: {
      base: 1399,
      premium: 1899,
      enterprise: 2499
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Distressed Denim Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Distressed Denim - Detail"
      }
    ],
    features: {
      base: ["Distressed finish", "Vintage wash", "Regular fit", "Authentic wear"],
      premium: ["Hand-distressed", "Premium vintage wash", "Slim fit", "Custom distressing", "Contrast stitching"],
      enterprise: ["Artisan distressing", "Luxury vintage treatment", "Designer fit", "Unique distressing", "Custom hardware", "Collector packaging"]
    },
    tags: ["distressed", "vintage", "trendy", "fashion", "edgy"]
  },
  {
    name: "Oversized Denim Jacket",
    category: "denim-shirt",
    description: "Oversized denim jacket with modern streetwear appeal. Features multiple pockets and customizable patches. Perfect for urban brands and contemporary fashion companies.",
    price: {
      base: 1599,
      premium: 2199,
      enterprise: 2899
    },
    deliveryTime: {
      base: 9,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Oversized Denim Jacket"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Denim Jacket - Back View"
      }
    ],
    features: {
      base: ["Oversized fit", "Multiple pockets", "Button closure", "Standard wash"],
      premium: ["Designer oversized cut", "Cargo pockets", "Custom buttons", "Enzyme wash", "Patch options"],
      enterprise: ["Couture oversized design", "Functional pockets", "Luxury hardware", "Signature wash", "Custom patches", "Designer packaging"]
    },
    tags: ["oversized", "denim jacket", "streetwear", "urban", "patches"]
  },

  // Windcheaters Category
  {
    name: "Lightweight Windcheater",
    category: "windcheaters",
    description: "Ultra-lightweight windcheater perfect for outdoor activities and sports events. Water-resistant with packable design. Ideal for active lifestyle brands and outdoor companies.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Lightweight Windcheater"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Windcheater - Packable"
      }
    ],
    features: {
      base: ["Water-resistant", "Lightweight", "Packable", "Basic colors"],
      premium: ["Waterproof coating", "Ultra-light fabric", "Stuff sack included", "Reflective details", "Ventilation"],
      enterprise: ["Advanced waterproofing", "Technical fabric", "Compression pack", "Safety features", "Custom ventilation", "Tech packaging"]
    },
    tags: ["lightweight", "packable", "outdoor", "sports", "water-resistant"]
  },
  {
    name: "Hooded Windcheater",
    category: "windcheaters",
    description: "Versatile hooded windcheater with adjustable features and multiple pockets. Perfect for team uniforms, corporate outdoor events, and adventure tourism companies.",
    price: {
      base: 1199,
      premium: 1699,
      enterprise: 2299
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Hooded Windcheater"
      },
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Windcheater - Hood Detail"
      }
    ],
    features: {
      base: ["Adjustable hood", "Front pockets", "Elastic cuffs", "Standard fit"],
      premium: ["Storm hood", "Zippered pockets", "Adjustable hem", "Athletic fit", "Breathable fabric"],
      enterprise: ["Technical hood system", "Multiple pockets", "Custom adjustments", "Performance fit", "Advanced materials", "Pro features"]
    },
    tags: ["hooded", "adjustable", "team", "corporate", "adventure"]
  },
  {
    name: "Reflective Safety Windcheater",
    category: "windcheaters",
    description: "High-visibility windcheater with reflective strips and safety features. Essential for construction companies, security services, and industrial safety programs.",
    price: {
      base: 1399,
      premium: 1899,
      enterprise: 2499
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Reflective Safety Windcheater"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Safety Windcheater - Reflective Detail"
      }
    ],
    features: {
      base: ["Reflective strips", "High-visibility colors", "Safety compliance", "Durable fabric"],
      premium: ["3M reflective tape", "ANSI compliant", "Reinforced seams", "ID pocket", "Radio loops"],
      enterprise: ["Premium reflective materials", "Full safety certification", "Custom safety features", "Durability testing", "Compliance documentation", "Safety packaging"]
    },
    tags: ["reflective", "safety", "high-visibility", "industrial", "construction"]
  },
  {
    name: "Softshell Windcheater",
    category: "windcheaters",
    description: "Premium softshell windcheater with stretch fabric and weather protection. Ideal for outdoor gear companies, adventure sports, and premium corporate gifts.",
    price: {
      base: 1799,
      premium: 2399,
      enterprise: 3199
    },
    deliveryTime: {
      base: 9,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Softshell Windcheater"
      },
      {
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        alt: "Softshell - Stretch Detail"
      }
    ],
    features: {
      base: ["Stretch fabric", "Water-resistant", "Breathable", "Comfortable fit"],
      premium: ["4-way stretch", "Waterproof membrane", "Windproof", "Articulated design", "Premium zippers"],
      enterprise: ["Advanced stretch technology", "Gore-Tex membrane", "Storm protection", "Ergonomic design", "Professional features", "Premium packaging"]
    },
    tags: ["softshell", "stretch", "premium", "outdoor", "weather-protection"]
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics');
    console.log('Connected to MongoDB');

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

    // Add createdBy field to each product
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert products
    const result = await Product.insertMany(productsWithCreator);
    console.log(`✅ Successfully seeded ${result.length} products`);

    console.log('🎉 Product seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();