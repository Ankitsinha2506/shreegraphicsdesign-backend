const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const adminUserId = '68a19a07279dcba0b246f27f'; // Admin user ID

const embroideryProducts = [
  {
    name: "Logo Embroidery Service",
    category: "embroidery",
    subcategory: "logo-embroidery",
    description: "Professional logo embroidery on shirts, jackets, caps, and bags. High-quality thread with precise stitching for corporate branding and promotional items.",
    price: {
      base: 299,
      premium: 499,
      enterprise: 799
    },
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Logo Embroidery Service",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Professional Logo Embroidery"
      }
    ],
    features: {
      base: ["Basic logo embroidery", "Standard thread colors", "Single position", "Up to 10,000 stitches"],
      premium: ["Detailed logo embroidery", "Premium thread colors", "Multiple positions", "Up to 20,000 stitches", "3D puff option"],
      enterprise: ["Master quality embroidery", "Unlimited thread colors", "Any position", "Unlimited stitches", "3D effects", "Metallic threads"]
    },
    tags: ["logo", "embroidery", "corporate", "branding", "professional"],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.8, count: 45 },
    createdBy: adminUserId
  },
  {
    name: "Custom Text Embroidery",
    category: "embroidery",
    subcategory: "text-embroidery",
    description: "Personalized text embroidery for names, titles, and messages. Perfect for uniforms, gifts, and promotional items with various font styles.",
    price: {
      base: 199,
      premium: 349,
      enterprise: 549
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 1
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Custom Text Embroidery",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Personalized Text Embroidery"
      }
    ],
    features: {
      base: ["Basic fonts", "Standard colors", "Up to 15 characters", "Single line"],
      premium: ["Premium fonts", "Multiple colors", "Up to 30 characters", "Multiple lines", "Special effects"],
      enterprise: ["Custom fonts", "Unlimited colors", "Unlimited characters", "Complex layouts", "Gradient effects", "Outline options"]
    },
    tags: ["text", "embroidery", "personalized", "names", "custom"],
    isActive: true,
    rating: { average: 4.7, count: 38 },
    createdBy: adminUserId
  },
  {
    name: "Embroidered Patches",
    category: "embroidery",
    subcategory: "custom-patches",
    description: "Custom embroidered patches for uniforms, jackets, and bags. Iron-on or sew-on options with various backing materials and edge finishes.",
    price: {
      base: 149,
      premium: 249,
      enterprise: 399
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Embroidered Patches",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Custom Patch Collection"
      }
    ],
    features: {
      base: ["Standard patch sizes", "Basic embroidery", "Iron-on backing", "Merrowed border"],
      premium: ["Custom sizes", "Detailed embroidery", "Multiple backing options", "Various border styles", "Color matching"],
      enterprise: ["Any size/shape", "Master embroidery", "Premium backings", "Laser cut edges", "Metallic threads", "3D effects"]
    },
    tags: ["patches", "embroidery", "uniform", "custom", "iron-on"],
    isActive: true,
    rating: { average: 4.6, count: 52 },
    createdBy: adminUserId
  },
  {
    name: "Monogramming Service",
    category: "embroidery",
    subcategory: "monogramming",
    description: "Elegant monogramming service for personal items, gifts, and corporate apparel. Classic and modern monogram styles with premium thread quality.",
    price: {
      base: 99,
      premium: 179,
      enterprise: 299
    },
    deliveryTime: {
      base: 2,
      premium: 1,
      enterprise: 1
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Monogramming Service",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Elegant Monograms"
      }
    ],
    features: {
      base: ["Basic monogram styles", "Standard thread", "Single color", "Small size"],
      premium: ["Premium styles", "Quality thread", "Multiple colors", "Medium size", "Script fonts"],
      enterprise: ["Luxury styles", "Premium thread", "Unlimited colors", "Any size", "Custom fonts", "Decorative elements"]
    },
    tags: ["monogram", "embroidery", "elegant", "personal", "gifts"],
    isActive: true,
    rating: { average: 4.9, count: 67 },
    createdBy: adminUserId
  },
  {
    name: "Appliqué Work",
    category: "embroidery",
    subcategory: "applique",
    description: "Creative appliqué embroidery combining fabric pieces with decorative stitching. Perfect for children's wear, team uniforms, and artistic designs.",
    price: {
      base: 399,
      premium: 699,
      enterprise: 1199
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Appliqué Work",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Creative Appliqué Designs"
      }
    ],
    features: {
      base: ["Basic appliqué", "Standard fabrics", "Simple designs", "Machine stitching"],
      premium: ["Detailed appliqué", "Premium fabrics", "Complex designs", "Decorative stitching", "Color coordination"],
      enterprise: ["Master appliqué", "Luxury fabrics", "Artistic designs", "Hand finishing", "Custom materials", "3D effects"]
    },
    tags: ["applique", "embroidery", "creative", "artistic", "fabric"],
    isActive: true,
    rating: { average: 4.5, count: 29 },
    createdBy: adminUserId
  },
  {
    name: "Thread Work Embroidery",
    category: "embroidery",
    subcategory: "thread-work",
    description: "Intricate thread work embroidery with various stitch patterns and textures. Traditional and contemporary designs for premium garments and accessories.",
    price: {
      base: 599,
      premium: 999,
      enterprise: 1699
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Thread Work Embroidery",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Intricate Thread Work"
      }
    ],
    features: {
      base: ["Basic thread work", "Standard patterns", "Machine embroidery", "Single color scheme"],
      premium: ["Detailed thread work", "Complex patterns", "Mixed techniques", "Multiple colors", "Texture effects"],
      enterprise: ["Master thread work", "Artistic patterns", "Hand embroidery", "Unlimited colors", "3D textures", "Custom designs"]
    },
    tags: ["thread-work", "embroidery", "intricate", "traditional", "premium"],
    isActive: true,
    rating: { average: 4.7, count: 34 },
    createdBy: adminUserId
  },
  {
    name: "Beadwork Embroidery",
    category: "embroidery",
    subcategory: "beadwork",
    description: "Luxurious beadwork embroidery with glass beads, pearls, and crystals. Perfect for evening wear, bridal garments, and high-end fashion items.",
    price: {
      base: 899,
      premium: 1599,
      enterprise: 2799
    },
    deliveryTime: {
      base: 21,
      premium: 14,
      enterprise: 10
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Beadwork Embroidery",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Luxury Beadwork"
      }
    ],
    features: {
      base: ["Basic beadwork", "Glass beads", "Simple patterns", "Standard colors"],
      premium: ["Detailed beadwork", "Mixed bead types", "Complex patterns", "Premium colors", "Pearl accents"],
      enterprise: ["Master beadwork", "Luxury materials", "Artistic patterns", "Custom colors", "Crystal accents", "Hand application"]
    },
    tags: ["beadwork", "embroidery", "luxury", "crystals", "bridal"],
    isActive: true,
    rating: { average: 4.8, count: 23 },
    createdBy: adminUserId
  },
  {
    name: "Sequin Work Embroidery",
    category: "embroidery",
    subcategory: "sequin-work",
    description: "Glamorous sequin work embroidery for special occasions and performance wear. Various sequin sizes and colors with secure attachment methods.",
    price: {
      base: 699,
      premium: 1199,
      enterprise: 2099
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Sequin Work Embroidery",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Glamorous Sequin Work"
      }
    ],
    features: {
      base: ["Basic sequin work", "Standard sequins", "Simple patterns", "Machine application"],
      premium: ["Detailed sequin work", "Mixed sequin sizes", "Complex patterns", "Secure attachment", "Color gradients"],
      enterprise: ["Master sequin work", "Premium sequins", "Artistic patterns", "Hand application", "Custom shapes", "Holographic effects"]
    },
    tags: ["sequin", "embroidery", "glamorous", "performance", "special-occasion"],
    isActive: true,
    rating: { average: 4.6, count: 31 },
    createdBy: adminUserId
  },
  {
    name: "Machine Embroidery Service",
    category: "embroidery",
    subcategory: "machine-embroidery",
    description: "High-speed machine embroidery for bulk orders and commercial projects. Consistent quality with fast turnaround times for large quantities.",
    price: {
      base: 79,
      premium: 149,
      enterprise: 249
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 1
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Machine Embroidery Service",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Commercial Machine Embroidery"
      }
    ],
    features: {
      base: ["Standard machine embroidery", "Basic designs", "Limited colors", "Bulk pricing"],
      premium: ["High-quality machine work", "Detailed designs", "Multiple colors", "Volume discounts", "Quality control"],
      enterprise: ["Premium machine embroidery", "Complex designs", "Unlimited colors", "Best pricing", "Quality guarantee", "Rush service"]
    },
    tags: ["machine", "embroidery", "bulk", "commercial", "fast"],
    isActive: true,
    rating: { average: 4.4, count: 89 },
    createdBy: adminUserId
  },
  {
    name: "Hand Embroidery Service",
    category: "embroidery",
    subcategory: "hand-embroidery",
    description: "Artisanal hand embroidery with traditional techniques and modern designs. Each piece is unique with exceptional attention to detail and craftsmanship.",
    price: {
      base: 1299,
      premium: 2299,
      enterprise: 3999
    },
    deliveryTime: {
      base: 28,
      premium: 21,
      enterprise: 14
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Hand Embroidery Service",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Artisanal Hand Embroidery"
      }
    ],
    features: {
      base: ["Basic hand embroidery", "Traditional stitches", "Simple designs", "Natural threads"],
      premium: ["Detailed hand work", "Mixed techniques", "Complex designs", "Premium threads", "Color blending"],
      enterprise: ["Master hand embroidery", "Artistic techniques", "Unique designs", "Luxury threads", "Custom patterns", "Heirloom quality"]
    },
    tags: ["hand", "embroidery", "artisanal", "traditional", "unique"],
    isActive: true,
    rating: { average: 4.9, count: 18 },
    createdBy: adminUserId
  },
  {
    name: "Corporate Embroidery Package",
    category: "embroidery",
    subcategory: "logo-embroidery",
    description: "Complete corporate embroidery package for uniforms, promotional items, and branded merchandise. Consistent branding across all items with bulk pricing.",
    price: {
      base: 199,
      premium: 349,
      enterprise: 599
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        alt: "Corporate Embroidery Package",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Corporate Branding Embroidery"
      }
    ],
    features: {
      base: ["Logo embroidery", "Standard placement", "Basic thread colors", "Bulk pricing"],
      premium: ["Logo + text embroidery", "Multiple placements", "Brand color matching", "Volume discounts", "Design consultation"],
      enterprise: ["Complete branding", "Any placement", "Exact color matching", "Best pricing", "Brand guidelines", "Account management"]
    },
    tags: ["corporate", "embroidery", "branding", "bulk", "uniform"],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.7, count: 76 },
    createdBy: adminUserId
  },
  {
    name: "Sports Team Embroidery",
    category: "embroidery",
    subcategory: "logo-embroidery",
    description: "Professional sports team embroidery for jerseys, caps, and team gear. Durable stitching that withstands washing and wear with team colors and logos.",
    price: {
      base: 249,
      premium: 399,
      enterprise: 649
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Sports Team Embroidery",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Team Logo Embroidery"
      }
    ],
    features: {
      base: ["Team logo embroidery", "Standard colors", "Basic placement", "Durable stitching"],
      premium: ["Logo + numbers/names", "Team color matching", "Multiple placements", "Reinforced stitching", "Player customization"],
      enterprise: ["Complete team package", "Exact color matching", "Any placement", "Premium durability", "Individual names/numbers", "Rush orders"]
    },
    tags: ["sports", "team", "embroidery", "jersey", "durable"],
    isActive: true,
    rating: { average: 4.6, count: 42 },
    createdBy: adminUserId
  }
];

async function addEmbroideryProducts() {
  try {
    console.log('🧵 Adding embroidery products...');
    
    // Check existing products
    const existingCount = await Product.countDocuments({ category: 'embroidery' });
    console.log(`📊 Current embroidery products: ${existingCount}`);
    
    // Add new products
    const result = await Product.insertMany(embroideryProducts);
    console.log(`✅ Added ${result.length} new embroidery products`);
    
    // Final count
    const finalCount = await Product.countDocuments({ category: 'embroidery' });
    console.log(`📊 Total embroidery products: ${finalCount}`);
    
    console.log('🎉 Embroidery products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding embroidery products:', error);
    process.exit(1);
  }
}

mongoose.connection.once('open', () => {
  console.log('📦 Connected to MongoDB');
  addEmbroideryProducts();
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});