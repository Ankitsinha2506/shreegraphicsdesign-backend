const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const User = require('../models/User');

const additionalProducts = [
  // Hand Bag Category
  {
    name: "Custom Leather Handbag",
    category: "hand-bag",
    description: "Premium leather handbag with custom embossing and branding options. Perfect for luxury brands, fashion companies, and high-end corporate gifts. Handcrafted quality with attention to detail.",
    price: {
      base: 2499,
      premium: 3499,
      enterprise: 4999
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Custom Leather Handbag"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Leather Handbag - Detail View"
      }
    ],
    features: {
      base: ["Genuine leather", "Custom embossing", "Interior pockets", "Adjustable strap"],
      premium: ["Premium leather", "Gold hardware", "Silk lining", "Multiple compartments", "Dust bag included"],
      enterprise: ["Luxury leather", "Custom hardware", "Designer lining", "Full customization", "Gift packaging", "Authenticity certificate"]
    },
    tags: ["handbag", "leather", "luxury", "custom", "fashion"]
  },
  {
    name: "Canvas Tote Bag Custom",
    category: "hand-bag",
    description: "Eco-friendly canvas tote bag with custom printing options. Ideal for promotional events, retail stores, and environmental campaigns. Durable and sustainable choice.",
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
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Canvas Tote Bag Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Canvas Tote - Printed Design"
      }
    ],
    features: {
      base: ["100% cotton canvas", "Screen printing", "Reinforced handles", "Standard size"],
      premium: ["Organic cotton", "Full-color printing", "Gusseted bottom", "Custom size options", "Interior pocket"],
      enterprise: ["Premium organic cotton", "Digital printing", "Custom construction", "Multiple sizes", "Branded labels", "Bulk packaging"]
    },
    tags: ["tote", "canvas", "eco-friendly", "promotional", "sustainable"]
  },
  {
    name: "Designer Clutch Bag",
    category: "hand-bag",
    description: "Elegant clutch bag with sophisticated design and premium materials. Perfect for evening events, luxury brands, and high-end promotional gifts. Compact yet stylish.",
    price: {
      base: 1299,
      premium: 1899,
      enterprise: 2699
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Designer Clutch Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Clutch Bag - Evening Style"
      }
    ],
    features: {
      base: ["Synthetic leather", "Magnetic closure", "Chain strap", "Compact design"],
      premium: ["Genuine leather", "Designer closure", "Detachable chain", "Interior mirror", "Card slots"],
      enterprise: ["Luxury materials", "Custom hardware", "Convertible design", "Premium lining", "Monogramming", "Luxury packaging"]
    },
    tags: ["clutch", "designer", "evening", "luxury", "elegant"]
  },
  {
    name: "Crossbody Messenger Bag",
    category: "hand-bag",
    description: "Versatile crossbody messenger bag with adjustable strap and multiple compartments. Great for casual brands, student organizations, and everyday promotional use.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 6,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Crossbody Messenger Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Messenger Bag - Crossbody Style"
      }
    ],
    features: {
      base: ["Canvas material", "Adjustable strap", "Front pocket", "Zipper closure"],
      premium: ["Water-resistant canvas", "Padded strap", "Multiple pockets", "Laptop compartment", "Reflective details"],
      enterprise: ["Premium canvas", "Ergonomic strap", "Organized compartments", "Tech features", "Custom branding", "Warranty included"]
    },
    tags: ["crossbody", "messenger", "casual", "versatile", "everyday"]
  },

  // Travel Bags Category
  {
    name: "Rolling Luggage Suitcase",
    category: "travel-bags",
    description: "Durable rolling luggage with custom branding options. Perfect for travel companies, corporate gifts, and hospitality industry. Hard shell construction with smooth wheels.",
    price: {
      base: 3499,
      premium: 4999,
      enterprise: 6999
    },
    deliveryTime: {
      base: 12,
      premium: 9,
      enterprise: 7
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Rolling Luggage Suitcase"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Luggage - Wheels Detail"
      }
    ],
    features: {
      base: ["Hard shell case", "4-wheel system", "TSA lock", "Telescopic handle"],
      premium: ["Premium ABS shell", "Silent wheels", "Combination lock", "Expandable design", "Interior organizers"],
      enterprise: ["Polycarbonate shell", "Japanese wheels", "Smart lock", "Full expansion", "Custom interior", "Lifetime warranty"]
    },
    tags: ["luggage", "travel", "rolling", "suitcase", "durable"]
  },
  {
    name: "Travel Duffel Bag",
    category: "travel-bags",
    description: "Spacious travel duffel bag with custom embroidery options. Ideal for sports teams, gym brands, and adventure travel companies. Lightweight yet durable construction.",
    price: {
      base: 1499,
      premium: 2199,
      enterprise: 2999
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Travel Duffel Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Duffel Bag - Open View"
      }
    ],
    features: {
      base: ["Polyester fabric", "Dual handles", "Shoulder strap", "Main compartment"],
      premium: ["Ripstop polyester", "Padded handles", "Detachable strap", "Shoe compartment", "Water-resistant"],
      enterprise: ["Ballistic nylon", "Ergonomic handles", "Convertible straps", "Multiple compartments", "Waterproof", "Custom features"]
    },
    tags: ["duffel", "travel", "sports", "gym", "adventure"]
  },
  {
    name: "Wheeled Travel Bag",
    category: "travel-bags",
    description: "Convenient wheeled travel bag combining the benefits of a duffel and rolling luggage. Perfect for frequent travelers and corporate travel programs.",
    price: {
      base: 2299,
      premium: 3199,
      enterprise: 4299
    },
    deliveryTime: {
      base: 10,
      premium: 8,
      enterprise: 6
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Wheeled Travel Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Wheeled Bag - Extended Handle"
      }
    ],
    features: {
      base: ["Hybrid design", "Retractable wheels", "Telescopic handle", "Durable fabric"],
      premium: ["Premium wheels", "Reinforced handle", "Weather-resistant", "Compression zippers", "ID tag"],
      enterprise: ["Silent wheels", "Ergonomic handle", "Waterproof fabric", "Expansion capability", "GPS tracking", "Premium warranty"]
    },
    tags: ["wheeled", "hybrid", "convenient", "travel", "versatile"]
  },
  {
    name: "Garment Travel Bag",
    category: "travel-bags",
    description: "Professional garment bag for wrinkle-free travel. Essential for business travelers, formal events, and luxury travel services. Keeps clothes pristine during transport.",
    price: {
      base: 1899,
      premium: 2699,
      enterprise: 3699
    },
    deliveryTime: {
      base: 9,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Garment Travel Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Garment Bag - Unfolded"
      }
    ],
    features: {
      base: ["Tri-fold design", "Garment hooks", "Shoe pockets", "Carry handles"],
      premium: ["Wrinkle-resistant lining", "Multiple hooks", "Accessory pockets", "Shoulder strap", "Breathable fabric"],
      enterprise: ["Premium lining", "Custom hooks", "Organized compartments", "Convertible design", "Luxury materials", "Concierge service"]
    },
    tags: ["garment", "business", "formal", "wrinkle-free", "professional"]
  },

  // Back Packs Category
  {
    name: "Hiking Backpack Custom",
    category: "back-packs",
    description: "Rugged hiking backpack with custom branding for outdoor adventure companies. Features multiple compartments, hydration system compatibility, and weather-resistant materials.",
    price: {
      base: 2199,
      premium: 3199,
      enterprise: 4399
    },
    deliveryTime: {
      base: 10,
      premium: 8,
      enterprise: 6
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Hiking Backpack Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Hiking Backpack - Trail Ready"
      }
    ],
    features: {
      base: ["40L capacity", "Padded straps", "Rain cover", "Multiple pockets"],
      premium: ["50L capacity", "Ergonomic design", "Hydration compatible", "Trekking pole attachment", "Reflective accents"],
      enterprise: ["60L capacity", "Custom fit system", "Advanced hydration", "Modular attachments", "GPS pocket", "Lifetime support"]
    },
    tags: ["hiking", "outdoor", "adventure", "rugged", "custom"]
  },
  {
    name: "School Backpack Branded",
    category: "back-packs",
    description: "Durable school backpack with custom school branding and student-friendly features. Perfect for educational institutions, student organizations, and academic programs.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 6,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "School Backpack Branded"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "School Backpack - Student Use"
      }
    ],
    features: {
      base: ["Book compartment", "Pencil organizer", "Water bottle holder", "Reflective strips"],
      premium: ["Laptop sleeve", "Tablet pocket", "Ergonomic design", "Lunch compartment", "Name tag"],
      enterprise: ["Tech compartment", "Charging port", "Custom organization", "Security features", "School colors", "Warranty program"]
    },
    tags: ["school", "student", "educational", "branded", "durable"]
  },
  {
    name: "Urban Daypack",
    category: "back-packs",
    description: "Stylish urban daypack for city commuting and daily use. Ideal for tech companies, urban brands, and modern lifestyle businesses. Sleek design with practical features.",
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
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Urban Daypack"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Urban Daypack - City Style"
      }
    ],
    features: {
      base: ["Minimalist design", "Laptop compartment", "Quick access pocket", "Comfortable straps"],
      premium: ["Premium materials", "Padded laptop sleeve", "Organization panel", "USB port", "Anti-theft features"],
      enterprise: ["Luxury materials", "Custom laptop protection", "Smart organization", "Wireless charging", "Security system", "Tech support"]
    },
    tags: ["urban", "daypack", "commuter", "tech", "modern"]
  },
  {
    name: "Sports Backpack Team",
    category: "back-packs",
    description: "Athletic sports backpack designed for team use and sports equipment. Perfect for sports teams, fitness brands, and athletic organizations. Durable and functional.",
    price: {
      base: 1399,
      premium: 1999,
      enterprise: 2799
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Sports Backpack Team"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Sports Backpack - Equipment Ready"
      }
    ],
    features: {
      base: ["Equipment compartment", "Ventilated shoe pocket", "Water bottle mesh", "Team colors"],
      premium: ["Separate gear compartment", "Laundry bag", "Hydration system", "Custom team logo", "Durable zippers"],
      enterprise: ["Professional gear organization", "Antimicrobial lining", "Advanced hydration", "Full team branding", "Performance materials", "Team support"]
    },
    tags: ["sports", "team", "athletic", "equipment", "functional"]
  },

  // Laptop Bags Category
  {
    name: "Executive Laptop Briefcase",
    category: "laptop-bags",
    description: "Professional leather laptop briefcase for executives and business professionals. Premium construction with sophisticated design and comprehensive laptop protection.",
    price: {
      base: 2799,
      premium: 3999,
      enterprise: 5499
    },
    deliveryTime: {
      base: 10,
      premium: 8,
      enterprise: 6
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Executive Laptop Briefcase"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Laptop Briefcase - Professional"
      }
    ],
    features: {
      base: ["Genuine leather", "Padded laptop compartment", "Document organizer", "Combination lock"],
      premium: ["Premium leather", "Shock-absorbing padding", "File organization", "RFID protection", "Shoulder strap"],
      enterprise: ["Luxury leather", "Military-grade protection", "Executive organization", "Biometric lock", "Custom monogramming", "Concierge service"]
    },
    tags: ["executive", "briefcase", "professional", "leather", "business"]
  },
  {
    name: "Casual Laptop Messenger",
    category: "laptop-bags",
    description: "Casual laptop messenger bag for everyday use and creative professionals. Comfortable crossbody design with modern aesthetics and practical functionality.",
    price: {
      base: 1299,
      premium: 1899,
      enterprise: 2599
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Casual Laptop Messenger"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Laptop Messenger - Casual Style"
      }
    ],
    features: {
      base: ["Canvas material", "Laptop sleeve", "Adjustable strap", "Front organizer"],
      premium: ["Water-resistant canvas", "Padded protection", "Ergonomic strap", "Tech organization", "Quick access"],
      enterprise: ["Premium canvas", "Advanced protection", "Custom strap system", "Smart organization", "Weather protection", "Tech support"]
    },
    tags: ["casual", "messenger", "creative", "crossbody", "everyday"]
  },
  {
    name: "Rolling Laptop Case",
    category: "laptop-bags",
    description: "Wheeled laptop case for mobile professionals and frequent travelers. Combines laptop protection with rolling convenience for easy transport.",
    price: {
      base: 2199,
      premium: 3199,
      enterprise: 4399
    },
    deliveryTime: {
      base: 9,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Rolling Laptop Case"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Rolling Case - Extended Handle"
      }
    ],
    features: {
      base: ["Rolling wheels", "Telescopic handle", "Laptop compartment", "File storage"],
      premium: ["Silent wheels", "Ergonomic handle", "Shock protection", "Expandable storage", "TSA friendly"],
      enterprise: ["Premium wheels", "Custom handle", "Military protection", "Modular storage", "Security features", "Travel warranty"]
    },
    tags: ["rolling", "wheeled", "mobile", "travel", "convenient"]
  },
  {
    name: "Laptop Sleeve Portfolio",
    category: "laptop-bags",
    description: "Slim laptop sleeve with portfolio features for minimalist professionals. Ultra-thin design with essential protection and document storage.",
    price: {
      base: 799,
      premium: 1199,
      enterprise: 1699
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Laptop Sleeve Portfolio"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Laptop Sleeve - Minimalist"
      }
    ],
    features: {
      base: ["Neoprene material", "Slim profile", "Document pocket", "Zipper closure"],
      premium: ["Premium neoprene", "Ultra-slim design", "Card organizer", "Magnetic closure", "Water-resistant"],
      enterprise: ["Luxury materials", "Custom-fit design", "Executive organizer", "Premium closure", "Full protection", "Personalization"]
    },
    tags: ["sleeve", "portfolio", "minimalist", "slim", "professional"]
  },

  // Office Bags Category
  {
    name: "Professional Tote Bag",
    category: "office-bags",
    description: "Sophisticated office tote bag for professional women. Combines style with functionality, perfect for corporate environments and business meetings.",
    price: {
      base: 1599,
      premium: 2299,
      enterprise: 3199
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 5
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Professional Tote Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Office Tote - Professional Style"
      }
    ],
    features: {
      base: ["Synthetic leather", "Laptop compartment", "Interior organizer", "Comfortable handles"],
      premium: ["Genuine leather", "Padded laptop section", "Multiple organizers", "Shoulder strap", "RFID protection"],
      enterprise: ["Luxury leather", "Custom laptop protection", "Executive organization", "Convertible straps", "Security features", "Monogramming"]
    },
    tags: ["tote", "professional", "office", "women", "sophisticated"]
  },
  {
    name: "Document Organizer Bag",
    category: "office-bags",
    description: "Specialized document organizer bag for legal professionals and consultants. Multiple compartments for files, documents, and office essentials.",
    price: {
      base: 1299,
      premium: 1899,
      enterprise: 2699
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Document Organizer Bag"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Document Bag - Organized Interior"
      }
    ],
    features: {
      base: ["File compartments", "Document organizer", "Pen holders", "Secure closure"],
      premium: ["Expandable files", "Tablet pocket", "Business card holder", "Combination lock", "Weather protection"],
      enterprise: ["Custom file system", "Tech integration", "Executive organizer", "Biometric security", "Premium materials", "Professional service"]
    },
    tags: ["document", "organizer", "legal", "consultant", "files"]
  },
  {
    name: "Conference Bag Custom",
    category: "office-bags",
    description: "Custom conference bag for corporate events and business meetings. Professional appearance with practical features for networking and presentations.",
    price: {
      base: 899,
      premium: 1399,
      enterprise: 1999
    },
    deliveryTime: {
      base: 6,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Conference Bag Custom"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Conference Bag - Event Ready"
      }
    ],
    features: {
      base: ["Canvas material", "Document pocket", "Pen loop", "Name tag holder"],
      premium: ["Premium canvas", "Tablet sleeve", "Business card organizer", "Custom branding", "Comfortable strap"],
      enterprise: ["Luxury materials", "Tech compartment", "Executive organizer", "Full customization", "Premium branding", "Event support"]
    },
    tags: ["conference", "corporate", "events", "networking", "custom"]
  },
  {
    name: "Executive Portfolio Case",
    category: "office-bags",
    description: "Premium executive portfolio case for high-level business professionals. Luxury materials and sophisticated design for important meetings and presentations.",
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
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Executive Portfolio Case"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Portfolio Case - Executive Style"
      }
    ],
    features: {
      base: ["Leather construction", "Document organizer", "Pen holders", "Zipper closure"],
      premium: ["Premium leather", "Tablet compartment", "Business card slots", "Combination lock", "Shoulder strap"],
      enterprise: ["Luxury leather", "Custom organization", "Executive features", "Security system", "Monogramming", "Concierge service"]
    },
    tags: ["executive", "portfolio", "luxury", "business", "premium"]
  },

  // Wallets Category
  {
    name: "Leather Bifold Wallet",
    category: "wallets",
    description: "Classic leather bifold wallet with custom embossing options. Perfect for corporate gifts, promotional items, and luxury brand merchandise. Timeless design with modern functionality.",
    price: {
      base: 599,
      premium: 899,
      enterprise: 1299
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Leather Bifold Wallet"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Bifold Wallet - Open View"
      }
    ],
    features: {
      base: ["Genuine leather", "Card slots", "Bill compartment", "ID window"],
      premium: ["Premium leather", "RFID blocking", "Coin pocket", "Custom embossing", "Gift box"],
      enterprise: ["Luxury leather", "Advanced RFID", "Multiple compartments", "Personalization", "Premium packaging", "Lifetime warranty"]
    },
    tags: ["wallet", "leather", "bifold", "classic", "corporate"]
  },
  {
    name: "Minimalist Card Holder",
    category: "wallets",
    description: "Sleek minimalist card holder for modern professionals. Ultra-slim design with essential card storage and contemporary appeal. Perfect for tech companies and modern brands.",
    price: {
      base: 399,
      premium: 599,
      enterprise: 899
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Minimalist Card Holder"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Card Holder - Slim Design"
      }
    ],
    features: {
      base: ["Aluminum construction", "Card slots", "Slim profile", "Modern design"],
      premium: ["Premium aluminum", "RFID protection", "Money clip", "Custom engraving", "Sleek finish"],
      enterprise: ["Titanium construction", "Advanced RFID", "Multi-function", "Laser engraving", "Premium finish", "Tech packaging"]
    },
    tags: ["minimalist", "card holder", "modern", "slim", "tech"]
  },
  {
    name: "Travel Wallet Organizer",
    category: "wallets",
    description: "Comprehensive travel wallet organizer for frequent travelers. Multiple compartments for passports, tickets, cards, and currency. Essential for travel companies and airlines.",
    price: {
      base: 899,
      premium: 1299,
      enterprise: 1799
    },
    deliveryTime: {
      base: 6,
      premium: 5,
      enterprise: 4
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Travel Wallet Organizer"
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Travel Wallet - Organized Interior"
      }
    ],
    features: {
      base: ["Passport holder", "Ticket pocket", "Card slots", "Currency compartment"],
      premium: ["RFID protection", "Boarding pass holder", "Pen loop", "Zippered pocket", "Travel accessories"],
      enterprise: ["Advanced RFID", "Custom organization", "Premium materials", "Travel features", "Personalization", "Travel insurance"]
    },
    tags: ["travel", "organizer", "passport", "frequent", "comprehensive"]
  },
  {
    name: "Money Clip Wallet",
    category: "wallets",
    description: "Sophisticated money clip wallet combining traditional and modern elements. Ideal for executive gifts and luxury brand promotions. Elegant and functional design.",
    price: {
      base: 799,
      premium: 1199,
      enterprise: 1699
    },
    deliveryTime: {
      base: 5,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Money Clip Wallet"
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        alt: "Money Clip - Elegant Design"
      }
    ],
    features: {
      base: ["Leather construction", "Money clip", "Card slots", "Compact design"],
      premium: ["Premium leather", "Metal clip", "RFID blocking", "Custom engraving", "Gift packaging"],
      enterprise: ["Luxury leather", "Precious metal clip", "Advanced RFID", "Personalization", "Premium packaging", "Luxury service"]
    },
    tags: ["money clip", "sophisticated", "executive", "luxury", "elegant"]
  }
];

const seedMoreProducts = async () => {
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
    const productsWithCreator = additionalProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert products
    const result = await Product.insertMany(productsWithCreator);
    console.log(`✅ Successfully seeded ${result.length} additional products`);

    console.log('🎉 Additional product seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding additional products:', error);
    process.exit(1);
  }
};

seedMoreProducts();