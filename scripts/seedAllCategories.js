const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')
require('dotenv').config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics')

const categories = {
  // Design Services
  'logo-design': [
    {
      name: 'Premium Logo Design Package',
      description: 'Professional logo design with multiple concepts, unlimited revisions, and brand guidelines.',
      price: { base: 2999, premium: 4999, enterprise: 7999 },
      images: [{ url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500', alt: 'Logo Design' }],
      features: ['Multiple Concepts', 'Unlimited Revisions', 'Brand Guidelines', 'Vector Files'],
      deliveryTime: '3-5 days',
      revisions: 'Unlimited'
    },
    {
      name: 'Startup Logo Design',
      description: 'Affordable logo design perfect for startups and small businesses.',
      price: { base: 1499, premium: 2499, enterprise: 3999 },
      images: [{ url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', alt: 'Startup Logo' }],
      features: ['2 Concepts', '3 Revisions', 'High-Res Files'],
      deliveryTime: '2-3 days',
      revisions: '3'
    },
    {
      name: 'Corporate Logo Design',
      description: 'Enterprise-level logo design with comprehensive brand identity package.',
      price: { base: 5999, premium: 8999, enterprise: 12999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Corporate Logo' }],
      features: ['5 Concepts', 'Unlimited Revisions', 'Brand Manual', 'Stationery Design'],
      deliveryTime: '5-7 days',
      revisions: 'Unlimited'
    },
    {
      name: 'Minimalist Logo Design',
      description: 'Clean, modern minimalist logo design for contemporary brands.',
      price: { base: 1999, premium: 3499, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500', alt: 'Minimalist Logo' }],
      features: ['Clean Design', '2 Revisions', 'Vector Format'],
      deliveryTime: '2-4 days',
      revisions: '2'
    }
  ],
  'business-card': [
    {
      name: 'Premium Business Card Design',
      description: 'Professional business card design with premium finishes and layouts.',
      price: { base: 799, premium: 1299, enterprise: 1999 },
      images: [{ url: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?w=500', alt: 'Business Card' }],
      features: ['Double-sided Design', 'Premium Paper', 'Multiple Layouts'],
      deliveryTime: '1-2 days',
      revisions: '2'
    },
    {
      name: 'Corporate Business Cards',
      description: 'Executive business card design for corporate professionals.',
      price: { base: 1299, premium: 1999, enterprise: 2999 },
      images: [{ url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500', alt: 'Corporate Cards' }],
      features: ['Elegant Design', 'Embossed Options', 'Gold Foiling'],
      deliveryTime: '2-3 days',
      revisions: '3'
    },
    {
      name: 'Creative Business Cards',
      description: 'Unique and creative business card designs that stand out.',
      price: { base: 999, premium: 1599, enterprise: 2499 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Creative Cards' }],
      features: ['Unique Shapes', 'Creative Layouts', 'Special Effects'],
      deliveryTime: '2-4 days',
      revisions: '2'
    },
    {
      name: 'Digital Business Cards',
      description: 'Modern digital business card design for online networking.',
      price: { base: 599, premium: 999, enterprise: 1499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500', alt: 'Digital Cards' }],
      features: ['QR Code Integration', 'Mobile Optimized', 'Interactive Elements'],
      deliveryTime: '1-2 days',
      revisions: '2'
    }
  ],
  'brochure': [
    {
      name: 'Tri-fold Brochure Design',
      description: 'Professional tri-fold brochure design for marketing campaigns.',
      price: { base: 1499, premium: 2499, enterprise: 3999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Brochure' }],
      features: ['Tri-fold Layout', 'High-Quality Images', 'Print Ready'],
      deliveryTime: '3-5 days',
      revisions: '3'
    },
    {
      name: 'Corporate Brochure',
      description: 'Executive corporate brochure design for business presentations.',
      price: { base: 2499, premium: 3999, enterprise: 5999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Corporate Brochure' }],
      features: ['Multi-page Layout', 'Professional Design', 'Brand Consistency'],
      deliveryTime: '5-7 days',
      revisions: '4'
    },
    {
      name: 'Product Catalog',
      description: 'Comprehensive product catalog design with detailed layouts.',
      price: { base: 3999, premium: 5999, enterprise: 8999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Product Catalog' }],
      features: ['Multi-page Design', 'Product Photography', 'Detailed Layouts'],
      deliveryTime: '7-10 days',
      revisions: '5'
    },
    {
      name: 'Event Brochure',
      description: 'Eye-catching event brochure design for promotions and invitations.',
      price: { base: 1299, premium: 1999, enterprise: 2999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Event Brochure' }],
      features: ['Event Details', 'Attractive Design', 'Easy to Read'],
      deliveryTime: '2-4 days',
      revisions: '3'
    }
  ],
  'banner': [
    {
      name: 'Web Banner Design',
      description: 'Professional web banner design for online advertising campaigns.',
      price: { base: 799, premium: 1299, enterprise: 1999 },
      images: [{ url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', alt: 'Web Banner' }],
      features: ['Multiple Sizes', 'Web Optimized', 'Call-to-Action'],
      deliveryTime: '1-2 days',
      revisions: '2'
    },
    {
      name: 'Trade Show Banner',
      description: 'Large format trade show banner design for exhibitions.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', alt: 'Trade Show Banner' }],
      features: ['Large Format', 'High Resolution', 'Professional Design'],
      deliveryTime: '3-5 days',
      revisions: '3'
    },
    {
      name: 'Social Media Banner',
      description: 'Social media banner design for various platforms.',
      price: { base: 599, premium: 999, enterprise: 1499 },
      images: [{ url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', alt: 'Social Banner' }],
      features: ['Platform Specific', 'Engaging Design', 'Brand Consistent'],
      deliveryTime: '1-2 days',
      revisions: '2'
    },
    {
      name: 'Promotional Banner',
      description: 'Eye-catching promotional banner for sales and offers.',
      price: { base: 899, premium: 1399, enterprise: 2099 },
      images: [{ url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', alt: 'Promotional Banner' }],
      features: ['Attention Grabbing', 'Sale Focus', 'Clear Messaging'],
      deliveryTime: '1-3 days',
      revisions: '2'
    }
  ],
  'poster': [
    {
      name: 'Event Poster Design',
      description: 'Creative event poster design for concerts, festivals, and gatherings.',
      price: { base: 1299, premium: 1999, enterprise: 2999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Event Poster' }],
      features: ['Creative Design', 'Event Details', 'High Impact'],
      deliveryTime: '2-4 days',
      revisions: '3'
    },
    {
      name: 'Movie Poster',
      description: 'Professional movie poster design with cinematic appeal.',
      price: { base: 2499, premium: 3999, enterprise: 5999 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Movie Poster' }],
      features: ['Cinematic Style', 'Character Focus', 'Title Treatment'],
      deliveryTime: '5-7 days',
      revisions: '4'
    },
    {
      name: 'Motivational Poster',
      description: 'Inspiring motivational poster design for offices and homes.',
      price: { base: 899, premium: 1399, enterprise: 2099 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Motivational Poster' }],
      features: ['Inspiring Quotes', 'Beautiful Typography', 'Uplifting Design'],
      deliveryTime: '2-3 days',
      revisions: '2'
    },
    {
      name: 'Product Poster',
      description: 'Product showcase poster design for marketing and promotion.',
      price: { base: 1599, premium: 2499, enterprise: 3699 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Product Poster' }],
      features: ['Product Focus', 'Marketing Copy', 'Brand Integration'],
      deliveryTime: '3-5 days',
      revisions: '3'
    }
  ],
  'flyer': [
    {
      name: 'Event Flyer Design',
      description: 'Attractive event flyer design for parties, concerts, and gatherings.',
      price: { base: 699, premium: 1099, enterprise: 1699 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Event Flyer' }],
      features: ['Eye-catching Design', 'Event Information', 'Easy Distribution'],
      deliveryTime: '1-2 days',
      revisions: '2'
    },
    {
      name: 'Business Flyer',
      description: 'Professional business flyer design for services and promotions.',
      price: { base: 899, premium: 1399, enterprise: 2099 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Business Flyer' }],
      features: ['Professional Layout', 'Service Details', 'Contact Information'],
      deliveryTime: '2-3 days',
      revisions: '3'
    },
    {
      name: 'Restaurant Flyer',
      description: 'Appetizing restaurant flyer design for menu promotions.',
      price: { base: 799, premium: 1199, enterprise: 1799 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Restaurant Flyer' }],
      features: ['Food Photography', 'Menu Highlights', 'Appetizing Design'],
      deliveryTime: '2-3 days',
      revisions: '2'
    },
    {
      name: 'Real Estate Flyer',
      description: 'Professional real estate flyer design for property listings.',
      price: { base: 999, premium: 1499, enterprise: 2299 },
      images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500', alt: 'Real Estate Flyer' }],
      features: ['Property Photos', 'Key Features', 'Contact Details'],
      deliveryTime: '2-4 days',
      revisions: '3'
    }
  ],
  'website-design': [
    {
      name: 'Landing Page Design',
      description: 'High-converting landing page design for marketing campaigns.',
      price: { base: 4999, premium: 7999, enterprise: 12999 },
      images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', alt: 'Landing Page' }],
      features: ['Conversion Focused', 'Mobile Responsive', 'Fast Loading'],
      deliveryTime: '5-7 days',
      revisions: '4'
    },
    {
      name: 'E-commerce Website',
      description: 'Complete e-commerce website design with shopping functionality.',
      price: { base: 15999, premium: 24999, enterprise: 39999 },
      images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', alt: 'E-commerce Site' }],
      features: ['Shopping Cart', 'Payment Integration', 'Product Catalog'],
      deliveryTime: '15-20 days',
      revisions: '6'
    },
    {
      name: 'Corporate Website',
      description: 'Professional corporate website design for businesses.',
      price: { base: 9999, premium: 15999, enterprise: 24999 },
      images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', alt: 'Corporate Website' }],
      features: ['Professional Design', 'CMS Integration', 'SEO Optimized'],
      deliveryTime: '10-14 days',
      revisions: '5'
    },
    {
      name: 'Portfolio Website',
      description: 'Creative portfolio website design for artists and professionals.',
      price: { base: 6999, premium: 10999, enterprise: 16999 },
      images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', alt: 'Portfolio Website' }],
      features: ['Gallery Integration', 'Creative Layout', 'Contact Forms'],
      deliveryTime: '7-10 days',
      revisions: '4'
    }
  ],
  // Apparel
  'cap': [
    {
      name: 'Custom Embroidered Caps',
      description: 'High-quality caps with custom embroidery for teams and businesses.',
      price: { base: 299, premium: 499, enterprise: 799 },
      images: [{ url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Embroidered Cap' }],
      features: ['Custom Embroidery', 'Multiple Colors', 'Adjustable Size'],
      deliveryTime: '5-7 days',
      revisions: '2'
    },
    {
      name: 'Sports Team Caps',
      description: 'Professional sports team caps with team logos and colors.',
      price: { base: 399, premium: 599, enterprise: 899 },
      images: [{ url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Sports Cap' }],
      features: ['Team Logo', 'Moisture Wicking', 'Durable Material'],
      deliveryTime: '7-10 days',
      revisions: '3'
    },
    {
      name: 'Corporate Caps',
      description: 'Professional corporate caps for company branding and events.',
      price: { base: 349, premium: 549, enterprise: 849 },
      images: [{ url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Corporate Cap' }],
      features: ['Company Logo', 'Professional Look', 'Bulk Discounts'],
      deliveryTime: '5-8 days',
      revisions: '2'
    },
    {
      name: 'Fashion Caps',
      description: 'Trendy fashion caps with stylish designs and premium materials.',
      price: { base: 449, premium: 699, enterprise: 999 },
      images: [{ url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Fashion Cap' }],
      features: ['Trendy Design', 'Premium Materials', 'Limited Edition'],
      deliveryTime: '7-10 days',
      revisions: '3'
    }
  ],
  'jackets': [
    {
      name: 'Custom Embroidered Jackets',
      description: 'Premium jackets with custom embroidery for corporate and casual wear.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Embroidered Jacket' }],
      features: ['Custom Embroidery', 'Weather Resistant', 'Multiple Sizes'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Corporate Blazers',
      description: 'Professional corporate blazers with company branding.',
      price: { base: 2999, premium: 4499, enterprise: 6999 },
      images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Corporate Blazer' }],
      features: ['Professional Cut', 'Company Logo', 'Tailored Fit'],
      deliveryTime: '14-18 days',
      revisions: '4'
    },
    {
      name: 'Sports Team Jackets',
      description: 'Team jackets with custom designs and team colors.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Team Jacket' }],
      features: ['Team Colors', 'Player Names', 'Durable Material'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Winter Jackets',
      description: 'Warm winter jackets with custom branding and insulation.',
      price: { base: 3499, premium: 4999, enterprise: 7499 },
      images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Winter Jacket' }],
      features: ['Thermal Insulation', 'Waterproof', 'Custom Branding'],
      deliveryTime: '15-20 days',
      revisions: '4'
    }
  ],
  'sweatshirt': [
    {
      name: 'Custom Printed Sweatshirts',
      description: 'Comfortable sweatshirts with custom prints and designs.',
      price: { base: 899, premium: 1399, enterprise: 2099 },
      images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Custom Sweatshirt' }],
      features: ['Custom Prints', 'Soft Material', 'Multiple Colors'],
      deliveryTime: '7-10 days',
      revisions: '3'
    },
    {
      name: 'Hooded Sweatshirts',
      description: 'Cozy hooded sweatshirts with custom embroidery and prints.',
      price: { base: 1199, premium: 1799, enterprise: 2699 },
      images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Hooded Sweatshirt' }],
      features: ['Hood Design', 'Kangaroo Pocket', 'Custom Graphics'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'Corporate Sweatshirts',
      description: 'Professional sweatshirts for corporate teams and events.',
      price: { base: 1099, premium: 1599, enterprise: 2399 },
      images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Corporate Sweatshirt' }],
      features: ['Company Logo', 'Professional Look', 'Bulk Orders'],
      deliveryTime: '7-10 days',
      revisions: '2'
    },
    {
      name: 'Sports Sweatshirts',
      description: 'Athletic sweatshirts for sports teams and fitness enthusiasts.',
      price: { base: 1299, premium: 1899, enterprise: 2799 },
      images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Sports Sweatshirt' }],
      features: ['Moisture Wicking', 'Team Colors', 'Performance Fabric'],
      deliveryTime: '8-12 days',
      revisions: '3'
    }
  ],
  'denim-shirt': [
    {
      name: 'Custom Denim Shirts',
      description: 'Stylish denim shirts with custom embroidery and patches.',
      price: { base: 1599, premium: 2399, enterprise: 3599 },
      images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Denim Shirt' }],
      features: ['Premium Denim', 'Custom Patches', 'Vintage Wash'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Embroidered Denim Shirts',
      description: 'Classic denim shirts with intricate embroidery work.',
      price: { base: 1899, premium: 2799, enterprise: 4199 },
      images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Embroidered Denim' }],
      features: ['Hand Embroidery', 'Artistic Designs', 'Quality Denim'],
      deliveryTime: '12-16 days',
      revisions: '4'
    },
    {
      name: 'Corporate Denim Shirts',
      description: 'Professional denim shirts for casual corporate environments.',
      price: { base: 1799, premium: 2599, enterprise: 3899 },
      images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Corporate Denim' }],
      features: ['Professional Cut', 'Company Branding', 'Comfortable Fit'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Designer Denim Shirts',
      description: 'High-end designer denim shirts with unique styling.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Designer Denim' }],
      features: ['Designer Cut', 'Premium Fabric', 'Unique Details'],
      deliveryTime: '14-18 days',
      revisions: '4'
    }
  ],
  'windcheaters': [
    {
      name: 'Custom Windcheater Jackets',
      description: 'Lightweight windcheater jackets with custom prints and logos.',
      price: { base: 1299, premium: 1899, enterprise: 2799 },
      images: [{ url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Windcheater' }],
      features: ['Wind Resistant', 'Custom Prints', 'Lightweight'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'Sports Windcheaters',
      description: 'Athletic windcheaters for sports teams and outdoor activities.',
      price: { base: 1499, premium: 2199, enterprise: 3299 },
      images: [{ url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Sports Windcheater' }],
      features: ['Breathable Fabric', 'Team Colors', 'Performance Design'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Corporate Windcheaters',
      description: 'Professional windcheaters for corporate outdoor events.',
      price: { base: 1399, premium: 2099, enterprise: 3099 },
      images: [{ url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Corporate Windcheater' }],
      features: ['Company Logo', 'Professional Look', 'Weather Protection'],
      deliveryTime: '8-12 days',
      revisions: '2'
    },
    {
      name: 'Fashion Windcheaters',
      description: 'Trendy windcheaters with fashionable designs and colors.',
      price: { base: 1699, premium: 2499, enterprise: 3699 },
      images: [{ url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Fashion Windcheater' }],
      features: ['Trendy Design', 'Fashion Colors', 'Stylish Cut'],
      deliveryTime: '10-14 days',
      revisions: '3'
    }
  ],
  'school-uniforms': [
    {
      name: 'Primary School Uniforms',
      description: 'Complete primary school uniform sets with school branding.',
      price: { base: 899, premium: 1299, enterprise: 1899 },
      images: [{ url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', alt: 'School Uniform' }],
      features: ['School Logo', 'Comfortable Fabric', 'Multiple Sizes'],
      deliveryTime: '10-14 days',
      revisions: '2'
    },
    {
      name: 'Secondary School Uniforms',
      description: 'Professional secondary school uniforms with embroidered badges.',
      price: { base: 1199, premium: 1699, enterprise: 2499 },
      images: [{ url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', alt: 'Secondary Uniform' }],
      features: ['Embroidered Badges', 'Durable Fabric', 'Formal Design'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Sports Uniforms',
      description: 'Athletic sports uniforms for school teams and competitions.',
      price: { base: 799, premium: 1199, enterprise: 1799 },
      images: [{ url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', alt: 'Sports Uniform' }],
      features: ['Moisture Wicking', 'Team Colors', 'Performance Fabric'],
      deliveryTime: '8-12 days',
      revisions: '2'
    },
    {
      name: 'Formal School Blazers',
      description: 'Formal school blazers with school crests and proper tailoring.',
      price: { base: 1999, premium: 2799, enterprise: 3999 },
      images: [{ url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', alt: 'School Blazer' }],
      features: ['School Crest', 'Tailored Fit', 'Premium Fabric'],
      deliveryTime: '14-18 days',
      revisions: '4'
    }
  ],
  // Bags
  'hand-bag': [
    {
      name: 'Custom Leather Handbags',
      description: 'Premium leather handbags with custom embossing and designs.',
      price: { base: 2999, premium: 4499, enterprise: 6999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Leather Handbag' }],
      features: ['Genuine Leather', 'Custom Embossing', 'Multiple Compartments'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Designer Handbags',
      description: 'Fashionable designer handbags with unique patterns and styles.',
      price: { base: 3999, premium: 5999, enterprise: 8999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Designer Handbag' }],
      features: ['Designer Patterns', 'Premium Materials', 'Limited Edition'],
      deliveryTime: '14-18 days',
      revisions: '4'
    },
    {
      name: 'Corporate Handbags',
      description: 'Professional handbags for corporate women with laptop compartments.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Corporate Handbag' }],
      features: ['Laptop Compartment', 'Professional Design', 'Durable Material'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Casual Handbags',
      description: 'Everyday casual handbags with comfortable straps and practical design.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Casual Handbag' }],
      features: ['Comfortable Straps', 'Practical Design', 'Multiple Colors'],
      deliveryTime: '8-12 days',
      revisions: '2'
    }
  ],
  'strolley-bags': [
    {
      name: 'Custom Trolley Bags',
      description: 'Durable trolley bags with custom branding and multiple compartments.',
      price: { base: 3999, premium: 5999, enterprise: 8999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Trolley Bag' }],
      features: ['Custom Branding', 'Multiple Compartments', 'Durable Wheels'],
      deliveryTime: '14-18 days',
      revisions: '3'
    },
    {
      name: 'Business Trolley Bags',
      description: 'Professional trolley bags for business travel with laptop sections.',
      price: { base: 4999, premium: 7499, enterprise: 11999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Business Trolley' }],
      features: ['Laptop Section', 'TSA Lock', 'Professional Design'],
      deliveryTime: '16-20 days',
      revisions: '4'
    },
    {
      name: 'Travel Trolley Bags',
      description: 'Large capacity trolley bags for extended travel and vacations.',
      price: { base: 3499, premium: 5199, enterprise: 7799 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Travel Trolley' }],
      features: ['Large Capacity', 'Expandable Design', 'Lightweight'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Cabin Trolley Bags',
      description: 'Compact cabin-sized trolley bags for airline travel.',
      price: { base: 2999, premium: 4499, enterprise: 6699 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Cabin Trolley' }],
      features: ['Cabin Size', 'Lightweight', 'Smooth Wheels'],
      deliveryTime: '10-14 days',
      revisions: '3'
    }
  ],
  'travel-bags': [
    {
      name: 'Custom Travel Duffel Bags',
      description: 'Spacious duffel bags with custom prints for travel and sports.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Travel Duffel' }],
      features: ['Custom Prints', 'Spacious Interior', 'Durable Material'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'Weekend Travel Bags',
      description: 'Compact weekend travel bags for short trips and getaways.',
      price: { base: 1599, premium: 2399, enterprise: 3599 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Weekend Bag' }],
      features: ['Compact Size', 'Multiple Pockets', 'Comfortable Handles'],
      deliveryTime: '7-10 days',
      revisions: '2'
    },
    {
      name: 'Adventure Travel Bags',
      description: 'Rugged travel bags for outdoor adventures and hiking.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Adventure Bag' }],
      features: ['Water Resistant', 'Rugged Design', 'External Attachments'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Luxury Travel Bags',
      description: 'Premium luxury travel bags with high-end materials and finishes.',
      price: { base: 4999, premium: 7499, enterprise: 11999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Luxury Travel Bag' }],
      features: ['Premium Materials', 'Luxury Finishes', 'Exclusive Design'],
      deliveryTime: '16-20 days',
      revisions: '4'
    }
  ],
  'back-packs': [
    {
      name: 'Custom School Backpacks',
      description: 'Durable school backpacks with custom designs and compartments.',
      price: { base: 1299, premium: 1899, enterprise: 2799 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'School Backpack' }],
      features: ['Custom Designs', 'Multiple Compartments', 'Ergonomic Design'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'Hiking Backpacks',
      description: 'Professional hiking backpacks with weather protection and storage.',
      price: { base: 2999, premium: 4499, enterprise: 6699 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Hiking Backpack' }],
      features: ['Weather Protection', 'Large Capacity', 'Comfort Padding'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Corporate Backpacks',
      description: 'Professional backpacks for corporate use with laptop compartments.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Corporate Backpack' }],
      features: ['Laptop Compartment', 'Professional Look', 'USB Charging Port'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Sports Backpacks',
      description: 'Athletic backpacks for sports equipment and gym essentials.',
      price: { base: 1699, premium: 2499, enterprise: 3699 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Sports Backpack' }],
      features: ['Sports Equipment Storage', 'Ventilated Compartments', 'Durable Material'],
      deliveryTime: '8-12 days',
      revisions: '2'
    }
  ],
  'laptop-bags': [
    {
      name: 'Premium Laptop Bags',
      description: 'High-quality laptop bags with padded protection and style.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Laptop Bag' }],
      features: ['Padded Protection', 'Stylish Design', 'Multiple Pockets'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'Business Laptop Cases',
      description: 'Professional laptop cases for business meetings and presentations.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Business Laptop Case' }],
      features: ['Professional Design', 'Document Compartments', 'Premium Materials'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Gaming Laptop Bags',
      description: 'Specialized laptop bags for gaming laptops with extra protection.',
      price: { base: 2199, premium: 3299, enterprise: 4899 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Gaming Laptop Bag' }],
      features: ['Extra Protection', 'Gaming Aesthetics', 'Accessory Pockets'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Convertible Laptop Bags',
      description: 'Versatile laptop bags that convert to backpacks or briefcases.',
      price: { base: 2799, premium: 4199, enterprise: 6299 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Convertible Laptop Bag' }],
      features: ['Convertible Design', 'Versatile Use', 'Premium Construction'],
      deliveryTime: '12-16 days',
      revisions: '4'
    }
  ],
  'office-bags': [
    {
      name: 'Executive Office Bags',
      description: 'Premium executive office bags for senior professionals.',
      price: { base: 3999, premium: 5999, enterprise: 8999 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Executive Office Bag' }],
      features: ['Executive Design', 'Premium Leather', 'Multiple Compartments'],
      deliveryTime: '14-18 days',
      revisions: '4'
    },
    {
      name: 'Professional Briefcases',
      description: 'Classic professional briefcases for business documents and laptops.',
      price: { base: 2999, premium: 4499, enterprise: 6699 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Professional Briefcase' }],
      features: ['Classic Design', 'Document Organization', 'Secure Locks'],
      deliveryTime: '12-16 days',
      revisions: '3'
    },
    {
      name: 'Modern Office Bags',
      description: 'Contemporary office bags with modern design and functionality.',
      price: { base: 2499, premium: 3699, enterprise: 5499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Modern Office Bag' }],
      features: ['Modern Design', 'Tech Integration', 'Lightweight'],
      deliveryTime: '10-14 days',
      revisions: '3'
    },
    {
      name: 'Messenger Office Bags',
      description: 'Stylish messenger bags for casual office environments.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Messenger Office Bag' }],
      features: ['Messenger Style', 'Casual Professional', 'Adjustable Strap'],
      deliveryTime: '8-12 days',
      revisions: '2'
    }
  ],
  'wallets': [
    {
      name: 'Custom Leather Wallets',
      description: 'Premium leather wallets with custom embossing and personalization.',
      price: { base: 799, premium: 1199, enterprise: 1799 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Leather Wallet' }],
      features: ['Custom Embossing', 'Genuine Leather', 'Multiple Card Slots'],
      deliveryTime: '5-7 days',
      revisions: '2'
    },
    {
      name: 'Corporate Gift Wallets',
      description: 'Elegant wallets perfect for corporate gifts and promotions.',
      price: { base: 999, premium: 1499, enterprise: 2299 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Corporate Wallet' }],
      features: ['Gift Packaging', 'Company Branding', 'Premium Quality'],
      deliveryTime: '7-10 days',
      revisions: '3'
    },
    {
      name: 'Designer Wallets',
      description: 'Fashionable designer wallets with unique patterns and styles.',
      price: { base: 1299, premium: 1899, enterprise: 2799 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Designer Wallet' }],
      features: ['Designer Patterns', 'Fashion Forward', 'Premium Materials'],
      deliveryTime: '8-12 days',
      revisions: '3'
    },
    {
      name: 'RFID Protection Wallets',
      description: 'Modern wallets with RFID protection for card security.',
      price: { base: 1099, premium: 1599, enterprise: 2399 },
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'RFID Wallet' }],
      features: ['RFID Protection', 'Security Features', 'Modern Design'],
      deliveryTime: '7-10 days',
      revisions: '2'
    }
  ],
  // Corporate
  'corporate': [
    {
      name: 'Corporate Branding Package',
      description: 'Complete corporate branding package with logo, stationery, and guidelines.',
      price: { base: 15999, premium: 24999, enterprise: 39999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Corporate Branding' }],
      features: ['Logo Design', 'Stationery Package', 'Brand Guidelines', 'Digital Assets'],
      deliveryTime: '15-20 days',
      revisions: '6'
    },
    {
      name: 'Corporate Merchandise',
      description: 'Custom corporate merchandise for employee gifts and promotions.',
      price: { base: 5999, premium: 8999, enterprise: 13999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Corporate Merchandise' }],
      features: ['Custom Products', 'Bulk Pricing', 'Brand Consistency'],
      deliveryTime: '10-14 days',
      revisions: '4'
    },
    {
      name: 'Corporate Event Materials',
      description: 'Complete event materials package for corporate events and conferences.',
      price: { base: 7999, premium: 11999, enterprise: 17999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Event Materials' }],
      features: ['Event Branding', 'Signage Design', 'Promotional Materials'],
      deliveryTime: '12-16 days',
      revisions: '5'
    },
    {
      name: 'Corporate Uniforms',
      description: 'Professional corporate uniforms with company branding.',
      price: { base: 9999, premium: 14999, enterprise: 22999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Corporate Uniforms' }],
      features: ['Professional Design', 'Company Branding', 'Multiple Sizes'],
      deliveryTime: '18-22 days',
      revisions: '4'
    }
  ],
  // Embroidery
  'embroidery': [
    {
      name: 'Custom Embroidery Services',
      description: 'Professional custom embroidery services for various garments and accessories.',
      price: { base: 299, premium: 499, enterprise: 799 },
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Custom Embroidery' }],
      features: ['Custom Designs', 'Multiple Colors', 'Various Fabrics'],
      deliveryTime: '5-7 days',
      revisions: '2'
    },
    {
      name: 'Logo Embroidery',
      description: 'Professional logo embroidery for corporate and business applications.',
      price: { base: 399, premium: 599, enterprise: 899 },
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Logo Embroidery' }],
      features: ['Logo Digitization', 'High Quality', 'Brand Consistency'],
      deliveryTime: '3-5 days',
      revisions: '3'
    },
    {
      name: 'Decorative Embroidery',
      description: 'Artistic decorative embroidery for fashion and home textiles.',
      price: { base: 599, premium: 899, enterprise: 1399 },
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Decorative Embroidery' }],
      features: ['Artistic Designs', 'Decorative Patterns', 'Premium Threads'],
      deliveryTime: '7-10 days',
      revisions: '3'
    },
    {
      name: 'Monogram Embroidery',
      description: 'Elegant monogram embroidery for personalization and gifts.',
      price: { base: 199, premium: 299, enterprise: 499 },
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Monogram Embroidery' }],
      features: ['Personal Monograms', 'Elegant Fonts', 'Gift Packaging'],
      deliveryTime: '2-3 days',
      revisions: '2'
    }
  ],
  // Other
  'other': [
    {
      name: 'Custom Promotional Products',
      description: 'Wide range of custom promotional products for marketing campaigns.',
      price: { base: 999, premium: 1499, enterprise: 2299 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Promotional Products' }],
      features: ['Various Products', 'Custom Branding', 'Bulk Pricing'],
      deliveryTime: '7-10 days',
      revisions: '3'
    },
    {
      name: 'Custom Signage Solutions',
      description: 'Professional signage solutions for businesses and events.',
      price: { base: 2999, premium: 4499, enterprise: 6999 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Custom Signage' }],
      features: ['Various Materials', 'Weather Resistant', 'Professional Installation'],
      deliveryTime: '10-14 days',
      revisions: '4'
    },
    {
      name: 'Custom Packaging Design',
      description: 'Creative packaging design solutions for products and brands.',
      price: { base: 1999, premium: 2999, enterprise: 4499 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Packaging Design' }],
      features: ['Creative Design', 'Brand Integration', 'Sustainable Options'],
      deliveryTime: '8-12 days',
      revisions: '4'
    },
    {
      name: 'Custom Awards & Trophies',
      description: 'Personalized awards and trophies for recognition and achievements.',
      price: { base: 1499, premium: 2299, enterprise: 3499 },
      images: [{ url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', alt: 'Awards Trophies' }],
      features: ['Custom Engraving', 'Various Materials', 'Recognition Design'],
      deliveryTime: '7-10 days',
      revisions: '3'
    }
  ]
}

const seedAllCategories = async () => {
  try {
    console.log('🌱 Starting comprehensive product seeding...')
    
    // Find an admin user to assign as creator
    let adminUser = await User.findOne({ role: 'admin' })
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@shreegraphics.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      })
      await adminUser.save()
      console.log('Created default admin user')
    }
    
    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️ Cleared existing products')
    
    let totalProducts = 0
    
    for (const [category, products] of Object.entries(categories)) {
      console.log(`📦 Adding products for category: ${category}`)
      
      const categoryProducts = products.map(product => {
        // Convert deliveryTime string to proper object structure
        const deliveryTimeStr = product.deliveryTime || '3-5 days'
        const baseDays = parseInt(deliveryTimeStr.split('-')[0]) || 3
        
        return {
          ...product,
          category,
          deliveryTime: {
            base: baseDays,
            premium: Math.max(1, baseDays - 1),
            enterprise: Math.max(1, baseDays - 2)
          },
          revisions: {
            base: 2,
            premium: 5,
            enterprise: -1
          },
          features: {
            base: product.features || [],
            premium: product.features || [],
            enterprise: product.features || []
          },
          tags: [category, 'custom', 'professional'],
          customizationOptions: [
            {
              name: 'Size Selection',
              type: 'size',
              options: [{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }],
              required: false
            },
            {
              name: 'Color Options',
              type: 'color',
              options: [{ label: 'Red', value: '#ff0000' }, { label: 'Blue', value: '#0000ff' }, { label: 'Green', value: '#00ff00' }],
              required: false
            }
          ],
          portfolio: [],
          rating: {
            average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
            count: Math.floor(Math.random() * 100) + 10
          },
          createdBy: adminUser._id,
          isActive: true,
          isFeatured: Math.random() > 0.7
        }
      })
      
      await Product.insertMany(categoryProducts)
      totalProducts += categoryProducts.length
      console.log(`✅ Added ${categoryProducts.length} products for ${category}`)
    }
    
    console.log(`🎉 Successfully seeded ${totalProducts} products across ${Object.keys(categories).length} categories!`)
    console.log('📊 Category breakdown:')
    
    for (const category of Object.keys(categories)) {
      const count = await Product.countDocuments({ category })
      console.log(`   ${category}: ${count} products`)
    }
    
  } catch (error) {
    console.error('❌ Error seeding products:', error)
  } finally {
    mongoose.connection.close()
  }
}

seedAllCategories()