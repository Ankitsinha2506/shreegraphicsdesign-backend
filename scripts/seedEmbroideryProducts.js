const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')
require('dotenv').config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shreegraphics')

const embroideryProducts = [
  // Logo Embroidery
  {
    name: 'Corporate Logo Embroidery',
    category: 'embroidery',
    subcategory: 'logo-embroidery',
    description: 'Professional corporate logo embroidery service for uniforms, shirts, and promotional items. High-quality thread work with precise detailing and color matching.',
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
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500',
        alt: 'Corporate Logo Embroidery',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        alt: 'Logo Embroidery Detail'
      }
    ],
    features: {
      base: ['Single color logo', 'Standard thread', 'Basic positioning', 'Digital proof'],
      premium: ['Multi-color logo', 'Premium thread', 'Custom positioning', 'Physical sample', '2 revisions'],
      enterprise: ['Complex logo design', 'Metallic threads', 'Multiple positions', 'Rush delivery', 'Unlimited revisions']
    },
    tags: ['logo', 'corporate', 'branding', 'professional', 'uniform'],
    revisions: {
      base: 1,
      premium: 2,
      enterprise: -1
    }
  },
  {
    name: 'Sports Team Logo Embroidery',
    category: 'embroidery',
    subcategory: 'logo-embroidery',
    description: 'Dynamic sports team logo embroidery for jerseys, caps, and team merchandise. Durable stitching designed to withstand regular washing and wear.',
    price: {
      base: 399,
      premium: 599,
      enterprise: 899
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        alt: 'Sports Logo Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Team logo', 'Standard colors', 'Jersey placement', 'Wash-resistant'],
      premium: ['Complex design', 'Gradient colors', 'Multiple placements', 'Extra durability'],
      enterprise: ['3D embroidery', 'Metallic accents', 'Custom sizing', 'Team consultation']
    },
    tags: ['sports', 'team', 'jersey', 'durable', 'athletic']
  },

  // Text Embroidery
  {
    name: 'Custom Name Embroidery',
    category: 'embroidery',
    subcategory: 'text-embroidery',
    description: 'Personalized name embroidery service for clothing, bags, and accessories. Choose from various fonts and thread colors to match your style.',
    price: {
      base: 199,
      premium: 299,
      enterprise: 499
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 1
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        alt: 'Custom Name Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Single name', 'Standard font', 'Basic colors', 'Standard placement'],
      premium: ['Multiple names', 'Premium fonts', 'Gradient colors', 'Custom placement'],
      enterprise: ['Complex text design', 'Decorative elements', 'Metallic threads', 'Rush service']
    },
    tags: ['personalization', 'name', 'custom', 'text', 'individual']
  },
  {
    name: 'Motivational Quote Embroidery',
    category: 'embroidery',
    subcategory: 'text-embroidery',
    description: 'Inspirational quotes and messages embroidered with artistic flair. Perfect for personal items, gifts, and motivational merchandise.',
    price: {
      base: 349,
      premium: 549,
      enterprise: 799
    },
    deliveryTime: {
      base: 5,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
        alt: 'Motivational Quote Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Short quote', 'Simple font', 'Single color', 'Standard layout'],
      premium: ['Long quote', 'Decorative font', 'Multi-color', 'Artistic layout'],
      enterprise: ['Custom calligraphy', 'Decorative borders', 'Special effects', 'Design consultation']
    },
    tags: ['motivation', 'quotes', 'inspiration', 'artistic', 'decorative']
  },

  // Custom Patches
  {
    name: 'Military Style Patches',
    category: 'embroidery',
    subcategory: 'custom-patches',
    description: 'High-quality military-style embroidered patches with merrowed borders. Perfect for uniforms, jackets, and tactical gear.',
    price: {
      base: 599,
      premium: 899,
      enterprise: 1299
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Military Style Patches',
        isPrimary: true
      }
    ],
    features: {
      base: ['Standard size', 'Basic design', 'Iron-on backing', 'Single quantity'],
      premium: ['Custom size', 'Complex design', 'Velcro backing', 'Bulk pricing'],
      enterprise: ['Any size', '3D elements', 'Multiple backings', 'Design service']
    },
    tags: ['military', 'patches', 'tactical', 'uniform', 'professional']
  },
  {
    name: 'Company Logo Patches',
    category: 'embroidery',
    subcategory: 'custom-patches',
    description: 'Corporate logo patches for employee uniforms and promotional merchandise. Professional quality with various backing options.',
    price: {
      base: 499,
      premium: 749,
      enterprise: 1099
    },
    deliveryTime: {
      base: 8,
      premium: 6,
      enterprise: 4
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
        alt: 'Company Logo Patches',
        isPrimary: true
      }
    ],
    features: {
      base: ['Logo reproduction', 'Standard colors', 'Heat seal backing', 'Minimum order'],
      premium: ['Color matching', 'Premium threads', 'Sew-on backing', 'Bulk discounts'],
      enterprise: ['Exact replication', 'Special threads', 'Custom backing', 'No minimum order']
    },
    tags: ['corporate', 'logo', 'uniform', 'branding', 'professional']
  },

  // Monogramming
  {
    name: 'Classic Monogram Service',
    category: 'embroidery',
    subcategory: 'monogramming',
    description: 'Elegant monogramming service for personal items, gifts, and luxury goods. Traditional and modern monogram styles available.',
    price: {
      base: 249,
      premium: 399,
      enterprise: 599
    },
    deliveryTime: {
      base: 4,
      premium: 3,
      enterprise: 2
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
        alt: 'Classic Monogram',
        isPrimary: true
      }
    ],
    features: {
      base: ['3-letter monogram', 'Standard font', 'Basic colors', 'Standard size'],
      premium: ['Custom initials', 'Premium fonts', 'Metallic threads', 'Various sizes'],
      enterprise: ['Decorative monogram', 'Luxury threads', 'Special effects', 'Design consultation']
    },
    tags: ['monogram', 'personalization', 'elegant', 'luxury', 'traditional']
  },
  {
    name: 'Wedding Monogram Embroidery',
    category: 'embroidery',
    subcategory: 'monogramming',
    description: 'Romantic wedding monograms for linens, robes, and keepsakes. Beautiful script fonts with decorative elements for your special day.',
    price: {
      base: 399,
      premium: 649,
      enterprise: 999
    },
    deliveryTime: {
      base: 7,
      premium: 5,
      enterprise: 3
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
        alt: 'Wedding Monogram',
        isPrimary: true
      }
    ],
    features: {
      base: ['Couple initials', 'Script font', 'Wedding date', 'Standard colors'],
      premium: ['Decorative elements', 'Premium threads', 'Custom design', 'Color coordination'],
      enterprise: ['Luxury design', 'Metallic accents', 'Special effects', 'Wedding consultation']
    },
    tags: ['wedding', 'romantic', 'couple', 'special occasion', 'luxury']
  },

  // Appliqué Work
  {
    name: 'Children\'s Appliqué Designs',
    category: 'embroidery',
    subcategory: 'applique',
    description: 'Colorful and fun appliqué designs for children\'s clothing. Cute animals, cartoon characters, and educational themes.',
    price: {
      base: 449,
      premium: 699,
      enterprise: 999
    },
    deliveryTime: {
      base: 6,
      premium: 4,
      enterprise: 3
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
        alt: 'Children Appliqué',
        isPrimary: true
      }
    ],
    features: {
      base: ['Simple design', 'Basic fabrics', 'Standard colors', 'Single appliqué'],
      premium: ['Complex design', 'Premium fabrics', 'Vibrant colors', 'Multiple elements'],
      enterprise: ['Custom design', 'Luxury fabrics', 'Special effects', 'Design consultation']
    },
    tags: ['children', 'fun', 'colorful', 'cute', 'educational']
  },
  {
    name: 'Decorative Appliqué Art',
    category: 'embroidery',
    subcategory: 'applique',
    description: 'Artistic appliqué work for home décor, fashion, and artistic projects. Combining fabric pieces with embroidery for stunning visual effects.',
    price: {
      base: 699,
      premium: 1099,
      enterprise: 1599
    },
    deliveryTime: {
      base: 10,
      premium: 7,
      enterprise: 5
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        alt: 'Decorative Appliqué',
        isPrimary: true
      }
    ],
    features: {
      base: ['Basic design', 'Standard fabrics', 'Simple stitching', 'Small size'],
      premium: ['Artistic design', 'Premium fabrics', 'Decorative stitching', 'Medium size'],
      enterprise: ['Custom artwork', 'Luxury materials', 'Complex techniques', 'Any size']
    },
    tags: ['artistic', 'decorative', 'fashion', 'home décor', 'creative']
  },

  // Thread Work
  {
    name: 'Traditional Thread Work',
    category: 'embroidery',
    subcategory: 'thread-work',
    description: 'Authentic traditional thread work patterns inspired by cultural heritage. Intricate designs using time-honored techniques.',
    price: {
      base: 799,
      premium: 1299,
      enterprise: 1999
    },
    deliveryTime: {
      base: 14,
      premium: 10,
      enterprise: 7
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Traditional Thread Work',
        isPrimary: true
      }
    ],
    features: {
      base: ['Basic patterns', 'Standard threads', 'Simple techniques', 'Small area'],
      premium: ['Complex patterns', 'Premium threads', 'Advanced techniques', 'Medium area'],
      enterprise: ['Master craftsmanship', 'Luxury threads', 'Heritage techniques', 'Large area']
    },
    tags: ['traditional', 'cultural', 'heritage', 'intricate', 'authentic']
  },
  {
    name: 'Modern Thread Art',
    category: 'embroidery',
    subcategory: 'thread-work',
    description: 'Contemporary thread art combining modern aesthetics with traditional embroidery techniques. Perfect for fashion and artistic applications.',
    price: {
      base: 899,
      premium: 1399,
      enterprise: 2199
    },
    deliveryTime: {
      base: 12,
      premium: 8,
      enterprise: 6
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500',
        alt: 'Modern Thread Art',
        isPrimary: true
      }
    ],
    features: {
      base: ['Modern design', 'Quality threads', 'Contemporary style', 'Standard size'],
      premium: ['Artistic design', 'Premium threads', 'Innovative style', 'Custom size'],
      enterprise: ['Avant-garde design', 'Luxury threads', 'Unique style', 'Artist collaboration']
    },
    tags: ['modern', 'contemporary', 'artistic', 'innovative', 'fashion']
  },

  // Beadwork
  {
    name: 'Luxury Beadwork Embroidery',
    category: 'embroidery',
    subcategory: 'beadwork',
    description: 'Exquisite beadwork embroidery using premium beads and crystals. Perfect for evening wear, bridal garments, and luxury accessories.',
    price: {
      base: 1299,
      premium: 1999,
      enterprise: 2999
    },
    deliveryTime: {
      base: 15,
      premium: 12,
      enterprise: 8
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
        alt: 'Luxury Beadwork',
        isPrimary: true
      }
    ],
    features: {
      base: ['Basic beads', 'Simple patterns', 'Standard colors', 'Small area'],
      premium: ['Premium beads', 'Complex patterns', 'Coordinated colors', 'Medium area'],
      enterprise: ['Luxury crystals', 'Intricate patterns', 'Custom colors', 'Large area']
    },
    tags: ['luxury', 'beads', 'crystals', 'evening wear', 'bridal']
  },
  {
    name: 'Cultural Beadwork Designs',
    category: 'embroidery',
    subcategory: 'beadwork',
    description: 'Traditional cultural beadwork patterns representing various ethnic and regional styles. Authentic designs with cultural significance.',
    price: {
      base: 999,
      premium: 1599,
      enterprise: 2399
    },
    deliveryTime: {
      base: 18,
      premium: 14,
      enterprise: 10
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Cultural Beadwork',
        isPrimary: true
      }
    ],
    features: {
      base: ['Traditional beads', 'Basic patterns', 'Authentic colors', 'Standard size'],
      premium: ['Quality beads', 'Complex patterns', 'Traditional colors', 'Custom size'],
      enterprise: ['Premium beads', 'Master patterns', 'Authentic materials', 'Cultural consultation']
    },
    tags: ['cultural', 'traditional', 'ethnic', 'authentic', 'heritage']
  },

  // Sequin Work
  {
    name: 'Glamorous Sequin Embroidery',
    category: 'embroidery',
    subcategory: 'sequin-work',
    description: 'Dazzling sequin embroidery for special occasions and performance wear. Creates stunning light-catching effects with premium sequins.',
    price: {
      base: 1199,
      premium: 1899,
      enterprise: 2799
    },
    deliveryTime: {
      base: 12,
      premium: 9,
      enterprise: 6
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
        alt: 'Sequin Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Standard sequins', 'Basic patterns', 'Single color', 'Small area'],
      premium: ['Premium sequins', 'Complex patterns', 'Multi-color', 'Medium area'],
      enterprise: ['Luxury sequins', 'Intricate patterns', 'Gradient effects', 'Large area']
    },
    tags: ['glamorous', 'sequins', 'sparkle', 'performance', 'special occasion']
  },
  {
    name: 'Bridal Sequin Work',
    category: 'embroidery',
    subcategory: 'sequin-work',
    description: 'Elegant sequin work for bridal wear and wedding accessories. Delicate patterns that add subtle sparkle to your special day.',
    price: {
      base: 1599,
      premium: 2399,
      enterprise: 3599
    },
    deliveryTime: {
      base: 20,
      premium: 15,
      enterprise: 10
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
        alt: 'Bridal Sequin Work',
        isPrimary: true
      }
    ],
    features: {
      base: ['Delicate sequins', 'Elegant patterns', 'Bridal colors', 'Standard coverage'],
      premium: ['Premium sequins', 'Intricate patterns', 'Custom colors', 'Extended coverage'],
      enterprise: ['Luxury sequins', 'Couture patterns', 'Bespoke design', 'Full coverage']
    },
    tags: ['bridal', 'wedding', 'elegant', 'delicate', 'luxury']
  },

  // Machine Embroidery
  {
    name: 'High-Volume Machine Embroidery',
    category: 'embroidery',
    subcategory: 'machine-embroidery',
    description: 'Efficient machine embroidery service for bulk orders and commercial projects. Consistent quality with fast turnaround times.',
    price: {
      base: 149,
      premium: 249,
      enterprise: 399
    },
    deliveryTime: {
      base: 3,
      premium: 2,
      enterprise: 1
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500',
        alt: 'Machine Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Standard design', 'Basic colors', 'Bulk pricing', 'Fast delivery'],
      premium: ['Custom design', 'Premium threads', 'Better pricing', 'Priority delivery'],
      enterprise: ['Complex design', 'Specialty threads', 'Best pricing', 'Rush delivery']
    },
    tags: ['machine', 'bulk', 'commercial', 'efficient', 'fast']
  },
  {
    name: 'Precision Machine Embroidery',
    category: 'embroidery',
    subcategory: 'machine-embroidery',
    description: 'High-precision machine embroidery for detailed logos and intricate designs. Computer-controlled accuracy with professional finish.',
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
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        alt: 'Precision Machine Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Precise stitching', 'Standard threads', 'Quality control', 'Digital proof'],
      premium: ['Ultra-precise', 'Premium threads', 'Enhanced QC', 'Physical sample'],
      enterprise: ['Perfect precision', 'Specialty threads', 'Complete QC', 'Multiple samples']
    },
    tags: ['precision', 'detailed', 'professional', 'accurate', 'quality']
  },

  // Hand Embroidery
  {
    name: 'Artisan Hand Embroidery',
    category: 'embroidery',
    subcategory: 'hand-embroidery',
    description: 'Exquisite hand embroidery crafted by skilled artisans. Each piece is unique with the personal touch that only handwork can provide.',
    price: {
      base: 1999,
      premium: 3499,
      enterprise: 5999
    },
    deliveryTime: {
      base: 21,
      premium: 14,
      enterprise: 10
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Hand Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Handcrafted', 'Traditional techniques', 'Quality threads', 'Unique piece'],
      premium: ['Master craftsmanship', 'Advanced techniques', 'Premium threads', 'Artistic design'],
      enterprise: ['Artisan expertise', 'Heritage techniques', 'Luxury threads', 'Bespoke creation']
    },
    tags: ['handmade', 'artisan', 'unique', 'traditional', 'luxury']
  },
  {
    name: 'Heritage Hand Embroidery',
    category: 'embroidery',
    subcategory: 'hand-embroidery',
    description: 'Traditional heritage hand embroidery preserving ancient techniques and cultural patterns. Authentic craftsmanship passed down through generations.',
    price: {
      base: 2499,
      premium: 4199,
      enterprise: 6999
    },
    deliveryTime: {
      base: 28,
      premium: 21,
      enterprise: 14
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        alt: 'Heritage Hand Embroidery',
        isPrimary: true
      }
    ],
    features: {
      base: ['Heritage patterns', 'Traditional methods', 'Authentic materials', 'Cultural significance'],
      premium: ['Master patterns', 'Ancient techniques', 'Premium materials', 'Historical accuracy'],
      enterprise: ['Rare patterns', 'Lost techniques', 'Luxury materials', 'Cultural consultation']
    },
    tags: ['heritage', 'traditional', 'cultural', 'authentic', 'historical']
  }
]

const seedEmbroideryProducts = async () => {
  try {
    console.log('🌱 Starting embroidery products seeding...')
    
    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'admin' })
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.')
      process.exit(1)
    }
    
    console.log(`👤 Using admin user: ${adminUser.email}`)
    
    // Add creator to each product
    const productsWithCreator = embroideryProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      isActive: true,
      isFeatured: Math.random() > 0.7 // 30% chance to be featured
    }))
    
    // Clear existing embroidery products
    await Product.deleteMany({ category: 'embroidery' })
    console.log('🗑️  Cleared existing embroidery products')
    
    // Insert new products
    const insertedProducts = await Product.insertMany(productsWithCreator)
    console.log(`✅ Successfully seeded ${insertedProducts.length} embroidery products`)
    
    // Display summary by subcategory
    const subcategoryCounts = {}
    insertedProducts.forEach(product => {
      subcategoryCounts[product.subcategory] = (subcategoryCounts[product.subcategory] || 0) + 1
    })
    
    console.log('\n📊 Products by subcategory:')
    Object.entries(subcategoryCounts).forEach(([subcategory, count]) => {
      console.log(`   ${subcategory}: ${count} products`)
    })
    
    console.log('\n🎉 Embroidery products seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding embroidery products:', error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the seeding function
seedEmbroideryProducts()