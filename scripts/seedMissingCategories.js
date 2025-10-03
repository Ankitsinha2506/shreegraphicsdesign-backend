const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const User = require('../models/User');

const missingCategoryProducts = [
  // School Uniforms Category
  {
    name: "Custom School Uniform Shirt",
    category: "school-uniforms",
    description: "High-quality school uniform shirt with custom embroidery and school branding. Perfect for educational institutions looking for professional, durable uniforms that represent their school identity.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        alt: "Custom School Uniform Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "School Uniform - Professional Look"
      }
    ],
    features: {
      base: ["Cotton blend fabric", "School logo embroidery", "Standard colors", "Durable construction"],
      premium: ["Premium cotton", "Custom embroidery", "Multiple color options", "Reinforced seams", "Name tags"],
      enterprise: ["Luxury cotton blend", "Full customization", "School colors", "Premium embroidery", "Bulk discounts", "Design consultation"]
    },
    tags: ["school", "uniform", "shirt", "education", "custom"]
  },
  {
    name: "School Uniform Blazer",
    category: "school-uniforms",
    description: "Elegant school blazer with custom badges and embroidery. Ideal for formal school events, ceremonies, and daily wear. Professional appearance with comfortable fit.",
    price: {
      base: 2199,
      premium: 2999,
      enterprise: 3999
    },
    deliveryTime: {
      base: 12,
      premium: 9,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        alt: "School Uniform Blazer"
      },
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "School Blazer - Formal Style"
      }
    ],
    features: {
      base: ["Polyester blend", "School badge", "Standard fit", "Basic lining"],
      premium: ["Wool blend", "Custom badges", "Tailored fit", "Quality lining", "Pocket details"],
      enterprise: ["Premium wool", "Full customization", "Perfect fit", "Luxury lining", "Custom buttons", "Design service"]
    },
    tags: ["blazer", "formal", "school", "ceremony", "professional"]
  },
  {
    name: "School Sports Uniform",
    category: "school-uniforms",
    description: "Athletic sports uniform for school teams and physical education. Moisture-wicking fabric with team colors and logos. Perfect for sports activities and competitions.",
    price: {
      base: 1299,
      premium: 1799,
      enterprise: 2499
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "School Sports Uniform"
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        alt: "Sports Uniform - Athletic Style"
      }
    ],
    features: {
      base: ["Polyester fabric", "Moisture-wicking", "Team colors", "Basic logo"],
      premium: ["Performance fabric", "Advanced moisture control", "Custom design", "Player numbers", "Breathable mesh"],
      enterprise: ["Pro-grade fabric", "Climate control", "Full customization", "Premium printing", "Team packages", "Coach consultation"]
    },
    tags: ["sports", "athletic", "team", "performance", "school"]
  },
  {
    name: "School Tie Custom",
    category: "school-uniforms",
    description: "Custom school tie with school colors and patterns. Essential accessory for formal school uniforms. High-quality fabric with professional appearance.",
    price: {
      base: 399,
      premium: 599,
      enterprise: 899
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        alt: "School Tie Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "School Tie - Professional"
      }
    ],
    features: {
      base: ["Polyester fabric", "School colors", "Standard pattern", "Regular length"],
      premium: ["Silk blend", "Custom pattern", "School logo", "Premium finish", "Multiple lengths"],
      enterprise: ["Pure silk", "Unique design", "Embroidered logo", "Luxury finish", "Custom packaging", "Design service"]
    },
    tags: ["tie", "accessory", "formal", "school", "professional"]
  },

  // Corporate Category
  {
    name: "Corporate Polo Shirt",
    category: "corporate",
    description: "Professional corporate polo shirt with company branding. Perfect for corporate events, team building, and professional casual wear. Comfortable and stylish.",
    price: {
      base: 799,
      premium: 1199,
      enterprise: 1699
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Corporate Polo Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Corporate Polo - Professional"
      }
    ],
    features: {
      base: ["Cotton blend", "Company logo", "Standard colors", "Regular fit"],
      premium: ["Premium cotton", "Embroidered logo", "Corporate colors", "Tailored fit", "Moisture-wicking"],
      enterprise: ["Luxury cotton", "Custom embroidery", "Brand colors", "Perfect fit", "Performance fabric", "Bulk pricing"]
    },
    tags: ["corporate", "polo", "professional", "branding", "team"]
  },
  {
    name: "Executive Dress Shirt",
    category: "corporate",
    description: "Premium executive dress shirt for corporate professionals. High-quality fabric with subtle company branding. Perfect for meetings, presentations, and formal events.",
    price: {
      base: 1499,
      premium: 2199,
      enterprise: 2999
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Executive Dress Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Dress Shirt - Executive Style"
      }
    ],
    features: {
      base: ["Cotton fabric", "Subtle branding", "Classic fit", "Standard colors"],
      premium: ["Premium cotton", "Custom monogram", "Slim fit", "Executive colors", "French cuffs"],
      enterprise: ["Luxury cotton", "Personalization", "Bespoke fit", "Custom colors", "Premium details", "Concierge service"]
    },
    tags: ["executive", "dress shirt", "formal", "corporate", "premium"]
  },
  {
    name: "Corporate Blazer",
    category: "corporate",
    description: "Sophisticated corporate blazer for business professionals. Tailored fit with company branding options. Ideal for corporate events and professional meetings.",
    price: {
      base: 3499,
      premium: 4999,
      enterprise: 6999
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Corporate Blazer"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Corporate Blazer - Business Style"
      }
    ],
    features: {
      base: ["Polyester blend", "Company badge", "Standard fit", "Basic lining"],
      premium: ["Wool blend", "Custom embroidery", "Tailored fit", "Quality lining", "Corporate colors"],
      enterprise: ["Premium wool", "Full customization", "Bespoke tailoring", "Luxury lining", "Executive details", "Personal fitting"]
    },
    tags: ["blazer", "corporate", "business", "professional", "tailored"]
  },
  {
    name: "Corporate Uniform Set",
    category: "corporate",
    description: "Complete corporate uniform set including shirt, pants, and accessories. Consistent branding across all pieces. Perfect for retail, hospitality, and service industries.",
    price: {
      base: 2999,
      premium: 4299,
      enterprise: 5999
    },
    deliveryTime: {
      base: 12,
      premium: 9,
      enterprise: 6
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Corporate Uniform Set"
      },
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Uniform Set - Complete Look"
      }
    ],
    features: {
      base: ["Complete set", "Consistent branding", "Standard fabrics", "Basic accessories"],
      premium: ["Premium fabrics", "Custom branding", "Coordinated colors", "Quality accessories", "Size range"],
      enterprise: ["Luxury materials", "Full customization", "Brand consistency", "Premium accessories", "Bulk packages", "Brand consultation"]
    },
    tags: ["uniform", "complete", "corporate", "branding", "professional"]
  },

  // Logo Design Category
  {
    name: "Embroidered Logo Cap",
    category: "logo-design",
    description: "High-quality cap with custom embroidered logo. Perfect for brand promotion, corporate gifts, and team merchandise. Durable construction with professional appearance.",
    price: {
      base: 599,
      premium: 899,
      enterprise: 1299
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Embroidered Logo Cap"
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Logo Cap - Embroidered Detail"
      }
    ],
    features: {
      base: ["Cotton cap", "Embroidered logo", "Adjustable strap", "Standard colors"],
      premium: ["Premium cotton", "3D embroidery", "Custom colors", "Structured crown", "Quality strap"],
      enterprise: ["Luxury materials", "Premium embroidery", "Brand colors", "Perfect fit", "Custom packaging", "Design service"]
    },
    tags: ["logo", "embroidered", "cap", "promotional", "branding"]
  },
  {
    name: "Logo Print T-Shirt",
    category: "logo-design",
    description: "Custom logo print t-shirt for brand promotion and corporate events. High-quality printing with vibrant colors. Comfortable fit for everyday wear.",
    price: {
      base: 499,
      premium: 799,
      enterprise: 1199
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Logo Print T-Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "T-Shirt - Logo Print"
      }
    ],
    features: {
      base: ["Cotton fabric", "Screen printing", "Standard colors", "Regular fit"],
      premium: ["Premium cotton", "Digital printing", "Custom colors", "Comfortable fit", "Fade-resistant"],
      enterprise: ["Organic cotton", "Premium printing", "Brand colors", "Perfect fit", "Eco-friendly", "Bulk discounts"]
    },
    tags: ["logo", "print", "t-shirt", "promotional", "comfortable"]
  },
  {
    name: "Logo Embossed Leather Goods",
    category: "logo-design",
    description: "Premium leather goods with embossed logo. Perfect for executive gifts and luxury brand merchandise. Sophisticated appearance with lasting quality.",
    price: {
      base: 1999,
      premium: 2999,
      enterprise: 4299
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Logo Embossed Leather Goods"
      },
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Leather Goods - Embossed Logo"
      }
    ],
    features: {
      base: ["Genuine leather", "Embossed logo", "Standard finish", "Quality construction"],
      premium: ["Premium leather", "Deep embossing", "Custom finish", "Luxury feel", "Gift packaging"],
      enterprise: ["Luxury leather", "Perfect embossing", "Custom design", "Executive quality", "Premium packaging", "Personalization"]
    },
    tags: ["logo", "embossed", "leather", "luxury", "executive"]
  },
  {
    name: "Logo Badge Collection",
    category: "logo-design",
    description: "Custom logo badge collection for uniforms and corporate wear. Various sizes and mounting options. Professional appearance with durable construction.",
    price: {
      base: 299,
      premium: 499,
      enterprise: 799
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        alt: "Logo Badge Collection"
      },
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
        alt: "Badge Collection - Various Sizes"
      }
    ],
    features: {
      base: ["Metal badge", "Logo design", "Pin backing", "Standard sizes"],
      premium: ["Premium metal", "Detailed logo", "Multiple backings", "Custom sizes", "Color options"],
      enterprise: ["Luxury materials", "Perfect detail", "Custom mounting", "Any size", "Full customization", "Design consultation"]
    },
    tags: ["logo", "badge", "uniform", "corporate", "professional"]
  },

  // Embroidery Category
  {
    name: "Custom Embroidery Service",
    category: "embroidery",
    description: "Professional custom embroidery service for any garment or accessory. High-quality thread with precise stitching. Perfect for personalizing corporate wear, uniforms, and promotional items.",
    price: {
      base: 199,
      premium: 399,
      enterprise: 699
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 1
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Custom Embroidery Service"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Embroidery - Detailed Work"
      }
    ],
    features: {
      base: ["Basic embroidery", "Standard thread", "Simple designs", "Single color"],
      premium: ["Detailed embroidery", "Premium thread", "Complex designs", "Multiple colors", "Logo recreation"],
      enterprise: ["Master embroidery", "Luxury thread", "Intricate designs", "Unlimited colors", "3D effects", "Design service"]
    },
    tags: ["embroidery", "custom", "personalization", "professional", "detailed"]
  },
  {
    name: "Embroidered Polo Shirt",
    category: "embroidery",
    description: "Premium polo shirt with custom embroidery. Perfect for corporate teams, sports clubs, and promotional events. Comfortable fabric with professional embroidered details.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Embroidered Polo Shirt"
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Polo Shirt - Embroidered Logo"
      }
    ],
    features: {
      base: ["Cotton polo", "Basic embroidery", "Standard colors", "Regular fit"],
      premium: ["Premium cotton", "Detailed embroidery", "Custom colors", "Tailored fit", "Quality finish"],
      enterprise: ["Luxury cotton", "Master embroidery", "Brand colors", "Perfect fit", "Premium details", "Bulk pricing"]
    },
    tags: ["embroidered", "polo", "corporate", "professional", "custom"]
  },
  {
    name: "Embroidered Jacket",
    category: "embroidery",
    description: "Stylish jacket with custom embroidery work. Ideal for team uniforms, corporate wear, and promotional merchandise. Durable construction with artistic embroidery.",
    price: {
      base: 2199,
      premium: 3199,
      enterprise: 4499
    },
    deliveryTime: {
      base: 10,
      premium: 8,
      enterprise: 6
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Embroidered Jacket"
      },
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Jacket - Custom Embroidery"
      }
    ],
    features: {
      base: ["Polyester jacket", "Basic embroidery", "Standard design", "Regular fit"],
      premium: ["Premium fabric", "Detailed embroidery", "Custom design", "Tailored fit", "Quality lining"],
      enterprise: ["Luxury materials", "Artistic embroidery", "Unique design", "Perfect fit", "Premium lining", "Design consultation"]
    },
    tags: ["embroidered", "jacket", "artistic", "team", "durable"]
  },
  {
    name: "Embroidered Accessories",
    category: "embroidery",
    description: "Collection of embroidered accessories including bags, hats, and patches. Perfect for brand promotion and personalized gifts. High-quality embroidery on various materials.",
    price: {
      base: 399,
      premium: 699,
      enterprise: 1199
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        alt: "Embroidered Accessories"
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        alt: "Accessories - Embroidered Collection"
      }
    ],
    features: {
      base: ["Basic accessories", "Simple embroidery", "Standard materials", "Single design"],
      premium: ["Quality accessories", "Detailed embroidery", "Premium materials", "Multiple designs", "Custom options"],
      enterprise: ["Luxury accessories", "Master embroidery", "Finest materials", "Unlimited designs", "Full customization", "Gift packaging"]
    },
    tags: ["embroidered", "accessories", "collection", "promotional", "personalized"]
  },

  // Branding Category (using other since branding is not in enum)
  {
    name: "Complete Brand Identity Package",
    category: "other",
    description: "Comprehensive brand identity package including logo design, color palette, typography, and brand guidelines. Perfect for new businesses and rebranding projects.",
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
        alt: "Complete Brand Identity Package"
      },
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Brand Identity - Design Elements"
      }
    ],
    features: {
      base: ["Logo design", "Color palette", "Basic typography", "Simple guidelines"],
      premium: ["Premium logo", "Extended palette", "Custom typography", "Detailed guidelines", "Business cards"],
      enterprise: ["Luxury branding", "Complete palette", "Exclusive typography", "Comprehensive guidelines", "Full stationery", "Brand consultation"]
    },
    tags: ["branding", "identity", "logo", "comprehensive", "professional"]
  },
  {
    name: "Brand Merchandise Design",
    category: "other",
    description: "Custom brand merchandise design service for promotional products and corporate gifts. Creative designs that represent your brand effectively across various products.",
    price: {
      base: 2999,
      premium: 4999,
      enterprise: 7999
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Brand Merchandise Design"
      },
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Merchandise - Brand Design"
      }
    ],
    features: {
      base: ["Basic designs", "Standard products", "Simple layouts", "Digital files"],
      premium: ["Creative designs", "Multiple products", "Professional layouts", "Print-ready files", "Revisions included"],
      enterprise: ["Innovative designs", "Unlimited products", "Premium layouts", "All file formats", "Unlimited revisions", "Design consultation"]
    },
    tags: ["branding", "merchandise", "design", "promotional", "creative"]
  },
  {
    name: "Brand Style Guide",
    category: "other",
    description: "Detailed brand style guide documenting logo usage, colors, typography, and brand voice. Essential for maintaining consistent brand identity across all communications.",
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
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Brand Style Guide"
      },
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Style Guide - Brand Standards"
      }
    ],
    features: {
      base: ["Basic guidelines", "Logo usage", "Color codes", "Typography rules"],
      premium: ["Detailed guidelines", "Usage examples", "Extended colors", "Font specifications", "Do's and don'ts"],
      enterprise: ["Comprehensive guide", "Real examples", "Complete palette", "Custom fonts", "Brand voice", "Training materials"]
    },
    tags: ["branding", "style guide", "guidelines", "consistency", "standards"]
  },
  {
    name: "Brand Consultation Service",
    category: "other",
    description: "Professional brand consultation service to develop brand strategy, positioning, and messaging. Expert guidance for building strong brand identity and market presence.",
    price: {
      base: 7999,
      premium: 14999,
      enterprise: 24999
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Brand Consultation Service"
      },
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Consultation - Brand Strategy"
      }
    ],
    features: {
      base: ["Brand analysis", "Basic strategy", "Market research", "Recommendations"],
      premium: ["Deep analysis", "Detailed strategy", "Competitor research", "Action plan", "Follow-up sessions"],
      enterprise: ["Comprehensive analysis", "Complete strategy", "Market intelligence", "Implementation plan", "Ongoing support", "Executive sessions"]
    },
    tags: ["branding", "consultation", "strategy", "professional", "expert"]
  },

  // Print Design Category (using business-card)
  {
    name: "Business Card Design",
    category: "business-card",
    description: "Professional business card design with custom layouts and branding elements. High-quality design that makes a lasting impression. Print-ready files included.",
    price: {
      base: 999,
      premium: 1999,
      enterprise: 3499
    },
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Business Card Design"
      },
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Business Cards - Professional Design"
      }
    ],
    features: {
      base: ["Standard design", "Basic layout", "Single-sided", "Digital files"],
      premium: ["Custom design", "Professional layout", "Double-sided", "Print-ready files", "Multiple concepts"],
      enterprise: ["Luxury design", "Premium layout", "Special finishes", "All file formats", "Unlimited revisions", "Design consultation"]
    },
    tags: ["print design", "business cards", "professional", "branding", "custom"]
  },
  {
    name: "Brochure Design",
    category: "brochure",
    description: "Creative brochure design for marketing and promotional materials. Engaging layouts with compelling visuals and clear messaging. Perfect for business promotion.",
    price: {
      base: 2999,
      premium: 4999,
      enterprise: 7999
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Brochure Design"
      },
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Brochure - Marketing Design"
      }
    ],
    features: {
      base: ["Tri-fold design", "Basic layout", "Standard images", "Digital files"],
      premium: ["Multi-fold options", "Professional layout", "Custom images", "Print-ready files", "Content writing"],
      enterprise: ["Any format", "Premium layout", "Professional photography", "All file formats", "Copywriting", "Design consultation"]
    },
    tags: ["print design", "brochure", "marketing", "promotional", "creative"]
  },
  {
    name: "Poster Design",
    category: "poster",
    description: "Eye-catching poster design for events, promotions, and advertising. Bold visuals with clear messaging that captures attention and drives action.",
    price: {
      base: 1499,
      premium: 2499,
      enterprise: 3999
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Poster Design"
      },
      {
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Poster - Event Design"
      }
    ],
    features: {
      base: ["Standard size", "Basic design", "Simple layout", "Digital files"],
      premium: ["Multiple sizes", "Creative design", "Professional layout", "Print-ready files", "Concept variations"],
      enterprise: ["Any size", "Premium design", "Innovative layout", "All file formats", "Unlimited concepts", "Rush delivery"]
    },
    tags: ["print design", "poster", "advertising", "events", "eye-catching"]
  },
  {
    name: "Packaging Design",
    category: "other",
    description: "Innovative packaging design that protects products while promoting brand identity. Creative solutions for retail packaging, shipping boxes, and product containers.",
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
        url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
        alt: "Packaging Design"
      },
      {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
        alt: "Packaging - Product Design"
      }
    ],
    features: {
      base: ["Basic packaging", "Standard materials", "Simple design", "Digital mockups"],
      premium: ["Custom packaging", "Premium materials", "Creative design", "3D mockups", "Structural design"],
      enterprise: ["Innovative packaging", "Luxury materials", "Award-winning design", "Physical prototypes", "Sustainability focus", "Design consultation"]
    },
    tags: ["print design", "packaging", "innovative", "branding", "creative"]
  }
];

const seedMissingCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics');
    console.log('Connected to MongoDB');

    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please run the main seeding script first.');
      process.exit(1);
    }

    // Add createdBy field to each product
    const productsWithCreator = missingCategoryProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert products
    const result = await Product.insertMany(productsWithCreator);
    console.log(`✅ Successfully seeded ${result.length} products for missing categories`);

    console.log('🎉 Missing categories seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding missing categories:', error);
    process.exit(1);
  }
};

seedMissingCategories();