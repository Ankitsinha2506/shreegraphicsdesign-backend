const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedNewCategoryProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

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

    const categoryData = {
      apparels: {
        'cap': {
          category: 'apparels',
          subcategory: 'cap',
          products: [
            {
              name: 'Custom Baseball Cap',
              description: 'High-quality cotton baseball cap with custom embroidery and printing options. Perfect for teams, events, and promotional use.',
              price: { base: 299, premium: 449, enterprise: 699 },
              images: [
                { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', alt: 'Baseball Cap', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500', alt: 'Cap Side View' }
              ],
              tags: ['cap', 'baseball', 'custom', 'embroidery', 'cotton'],
              features: {
                base: ['Cotton material', 'Adjustable strap', 'Basic embroidery'],
                premium: ['Premium cotton', 'Custom colors', 'Advanced embroidery'],
                enterprise: ['Premium materials', 'Multiple designs', 'Bulk customization']
              },
              deliveryTime: { base: 7, premium: 5, enterprise: 3 },
              revisions: { base: 2, premium: 3, enterprise: -1 }
            }
          ]
        },
        'jackets': {
          category: 'apparels',
          subcategory: 'jackets',
          products: [
            {
              name: 'Custom Varsity Jacket',
              description: 'Classic varsity jacket with custom patches, embroidery, and color combinations. Perfect for schools, teams, and organizations.',
              price: { base: 1299, premium: 1899, enterprise: 2499 },
              images: [
                { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', alt: 'Varsity Jacket', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Jacket Detail' }
              ],
              tags: ['jacket', 'varsity', 'custom', 'patches', 'team'],
              features: {
                base: ['Wool body', 'Leather sleeves', 'Basic patches'],
                premium: ['Premium wool', 'Custom patches', 'Multiple colors'],
                enterprise: ['Premium materials', 'Complex designs', 'Bulk orders']
              },
              deliveryTime: { base: 14, premium: 10, enterprise: 7 },
              revisions: { base: 2, premium: 4, enterprise: -1 }
            }
          ]
        },
        'sweatshirt': {
          category: 'apparels',
          subcategory: 'sweatshirt',
          products: [
            {
              name: 'Custom Hoodie Sweatshirt',
              description: 'Comfortable cotton blend hoodie with custom printing and embroidery options. Perfect for casual wear and team uniforms.',
              price: { base: 799, premium: 1199, enterprise: 1699 },
              images: [
                { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Hoodie Sweatshirt', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Hood Detail' }
              ],
              tags: ['hoodie', 'sweatshirt', 'cotton', 'custom', 'comfortable'],
              features: {
                base: ['Cotton blend', 'Kangaroo pocket', 'Basic printing'],
                premium: ['Premium cotton', 'Fleece lining', 'Custom embroidery'],
                enterprise: ['Organic cotton', 'Multiple customizations', 'Bulk pricing']
              },
              deliveryTime: { base: 10, premium: 7, enterprise: 5 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        },
        'denim-shirt': {
          category: 'apparels',
          subcategory: 'denim-shirt',
          products: [
            {
              name: 'Classic Denim Work Shirt',
              description: 'Durable denim work shirt with custom embroidery options. Perfect for industrial and casual wear.',
              price: { base: 899, premium: 1299, enterprise: 1799 },
              images: [
                { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Denim Work Shirt', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', alt: 'Shirt Detail' }
              ],
              tags: ['denim', 'work shirt', 'durable', 'embroidery', 'industrial'],
              features: {
                base: ['100% cotton denim', 'Button-down', 'Chest pockets'],
                premium: ['Reinforced stitching', 'Custom embroidery', 'Multiple washes'],
                enterprise: ['Premium denim', 'Custom design', 'Bulk orders']
              },
              deliveryTime: { base: 12, premium: 8, enterprise: 6 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        },
        'windcheaters': {
          category: 'apparels',
          subcategory: 'windcheaters',
          products: [
            {
              name: 'Lightweight Windcheater',
              description: 'Ultra-lightweight windcheater with custom printing options. Perfect for outdoor sports and activities.',
              price: { base: 699, premium: 999, enterprise: 1399 },
              images: [
                { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', alt: 'Lightweight Windcheater', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Packable Design' }
              ],
              tags: ['lightweight', 'windcheater', 'outdoor', 'sports', 'packable'],
              features: {
                base: ['Ultra-lightweight', 'Water-resistant', 'Packable'],
                premium: ['Breathable fabric', 'Reflective strips', 'Custom prints'],
                enterprise: ['Premium materials', 'Team designs', 'Bulk orders']
              },
              deliveryTime: { base: 10, premium: 7, enterprise: 5 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        }
      },
      travels: {
        'hand-bag': {
          category: 'travels',
          subcategory: 'hand-bag',
          products: [
            {
              name: 'Custom Canvas Tote Bag',
              description: 'Durable canvas tote bag with custom printing and embroidery options. Perfect for shopping and promotional use.',
              price: { base: 399, premium: 599, enterprise: 899 },
              images: [
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Canvas Tote Bag', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Tote Handle' }
              ],
              tags: ['canvas', 'tote', 'shopping', 'promotional', 'eco-friendly'],
              features: {
                base: ['Canvas material', 'Basic printing', 'Standard size'],
                premium: ['Premium canvas', 'Custom colors', 'Multiple sizes'],
                enterprise: ['Organic canvas', 'Complex designs', 'Bulk orders']
              },
              deliveryTime: { base: 5, premium: 3, enterprise: 2 },
              revisions: { base: 2, premium: 4, enterprise: -1 }
            }
          ]
        },
        'strolley-bags': {
          category: 'travels',
          subcategory: 'strolley-bags',
          products: [
            {
              name: 'Hard Shell Trolley Bag',
              description: 'Durable hard shell trolley bag with custom branding options. Perfect for corporate travel and gifts.',
              price: { base: 2499, premium: 3499, enterprise: 4999 },
              images: [
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Hard Shell Trolley', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Trolley Wheels' }
              ],
              tags: ['hard shell', 'trolley', 'travel', 'corporate', 'durable'],
              features: {
                base: ['ABS shell', '4-wheel system', 'TSA lock'],
                premium: ['Polycarbonate shell', 'Custom branding', 'Expandable design'],
                enterprise: ['Premium materials', 'Multiple customizations', 'Warranty']
              },
              deliveryTime: { base: 20, premium: 15, enterprise: 10 },
              revisions: { base: 1, premium: 3, enterprise: -1 }
            }
          ]
        },
        'travel-bags': {
          category: 'travels',
          subcategory: 'travel-bags',
          products: [
            {
              name: 'Weekend Duffle Bag',
              description: 'Spacious duffle bag with custom embroidery options. Perfect for weekend trips and gym use.',
              price: { base: 899, premium: 1299, enterprise: 1799 },
              images: [
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Duffle Bag', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', alt: 'Duffle Handle' }
              ],
              tags: ['duffle', 'weekend', 'gym', 'embroidery', 'spacious'],
              features: {
                base: ['Canvas material', 'Shoulder strap', 'Basic embroidery'],
                premium: ['Water-resistant', 'Custom embroidery', 'Shoe compartment'],
                enterprise: ['Premium materials', 'Multiple designs', 'Travel accessories']
              },
              deliveryTime: { base: 12, premium: 8, enterprise: 6 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        },
        'back-packs': {
          category: 'travels',
          subcategory: 'back-packs',
          products: [
            {
              name: 'School Backpack',
              description: 'Durable school backpack with custom embroidery and school logo options. Perfect for students.',
              price: { base: 699, premium: 999, enterprise: 1399 },
              images: [
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'School Backpack', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'School Features' }
              ],
              tags: ['school', 'students', 'embroidery', 'logo', 'durable'],
              features: {
                base: ['Multiple compartments', 'Padded straps', 'Basic embroidery'],
                premium: ['Laptop compartment', 'Custom embroidery', 'Reflective strips'],
                enterprise: ['Premium materials', 'School branding', 'Bulk orders']
              },
              deliveryTime: { base: 10, premium: 7, enterprise: 5 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        },
        'laptop-bags': {
          category: 'travels',
          subcategory: 'laptop-bags',
          products: [
            {
              name: 'Professional Laptop Briefcase',
              description: 'Executive laptop briefcase with custom embossing and corporate branding. Perfect for business professionals.',
              price: { base: 1599, premium: 2299, enterprise: 3199 },
              images: [
                { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', alt: 'Laptop Briefcase', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Professional Design' }
              ],
              tags: ['briefcase', 'executive', 'embossing', 'corporate', 'professional'],
              features: {
                base: ['Laptop protection', 'Document pockets', 'Basic embossing'],
                premium: ['Premium leather', 'Custom embossing', 'Business organizer'],
                enterprise: ['Luxury materials', 'Multiple brandings', 'Executive accessories']
              },
              deliveryTime: { base: 18, premium: 12, enterprise: 8 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        }
      },
      leather: {
        'office-bags': {
          category: 'leather',
          subcategory: 'office-bags',
          products: [
            {
              name: 'Executive Leather Briefcase',
              description: 'Premium leather briefcase with custom embossing and branding options. Perfect for corporate gifts and professional use.',
              price: { base: 2499, premium: 3499, enterprise: 4999 },
              images: [
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Leather Briefcase', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Briefcase Detail' }
              ],
              tags: ['leather', 'briefcase', 'executive', 'corporate', 'professional'],
              features: {
                base: ['Genuine leather', 'Basic embossing', 'Standard compartments'],
                premium: ['Premium leather', 'Custom embossing', 'Multiple compartments'],
                enterprise: ['Top-grain leather', 'Complex branding', 'Luxury finish']
              },
              deliveryTime: { base: 10, premium: 7, enterprise: 5 },
              revisions: { base: 2, premium: 4, enterprise: -1 }
            }
          ]
        },
        'wallets': {
          category: 'leather',
          subcategory: 'wallets',
          products: [
            {
              name: 'Executive Leather Wallet',
              description: 'Premium leather wallet with custom embossing and corporate branding. Perfect for executive gifts.',
              price: { base: 799, premium: 1199, enterprise: 1699 },
              images: [
                { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', alt: 'Executive Wallet', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Wallet Interior' }
              ],
              tags: ['executive', 'wallet', 'embossing', 'corporate', 'gifts'],
              features: {
                base: ['Genuine leather', 'Card slots', 'Basic embossing'],
                premium: ['Italian leather', 'Custom embossing', 'RFID protection'],
                enterprise: ['Designer leather', 'Multiple customizations', 'Gift packaging']
              },
              deliveryTime: { base: 12, premium: 8, enterprise: 5 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        }
      },
      uniforms: {
        'school-uniforms': {
          category: 'uniforms',
          subcategory: 'school-uniforms',
          products: [
            {
              name: 'Custom School Shirt',
              description: 'High-quality school uniform shirt with custom embroidery, logos, and school branding.',
              price: { base: 599, premium: 799, enterprise: 1099 },
              images: [
                { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'School Shirt', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Shirt Detail' }
              ],
              tags: ['uniform', 'school', 'shirt', 'custom', 'embroidery'],
              features: {
                base: ['Cotton blend', 'Basic embroidery', 'Standard colors'],
                premium: ['Premium cotton', 'Custom embroidery', 'Multiple colors'],
                enterprise: ['Premium materials', 'Complex designs', 'Bulk orders']
              },
              deliveryTime: { base: 7, premium: 5, enterprise: 3 },
              revisions: { base: 2, premium: 4, enterprise: -1 }
            }
          ]
        },
        'corporate': {
          category: 'uniforms',
          subcategory: 'corporate',
          products: [
            {
              name: 'Corporate Dress Shirt',
              description: 'Professional corporate dress shirt with custom company branding and executive styling.',
              price: { base: 799, premium: 1199, enterprise: 1699 },
              images: [
                { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Corporate Dress Shirt', isPrimary: true },
                { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Executive Style' }
              ],
              tags: ['corporate', 'dress shirt', 'professional', 'branding', 'executive'],
              features: {
                base: ['Cotton blend', 'Professional cut', 'Basic branding'],
                premium: ['Premium cotton', 'Custom branding', 'Wrinkle-free'],
                enterprise: ['Luxury cotton', 'Multiple brandings', 'Executive accessories']
              },
              deliveryTime: { base: 12, premium: 8, enterprise: 6 },
              revisions: { base: 2, premium: 5, enterprise: -1 }
            }
          ]
        }
      }
    };

    let totalProducts = 0;
    const categoryStats = {};

    for (const [categoryKey, categorySubcategories] of Object.entries(categoryData)) {
      for (const [subcategoryKey, subcategoryData] of Object.entries(categorySubcategories)) {
        const { category, subcategory, products } = subcategoryData;
        
        if (!categoryStats[category]) {
          categoryStats[category] = 0;
        }

        for (const productData of products) {
          const product = new Product({
            ...productData,
            category,
            subcategory,
            createdBy: adminUser._id,
            customization: {
              allowCustomization: true,
              customizationOptions: ['color', 'size', 'logo', 'text'],
              additionalCost: 50
            },
            isActive: true,
            isFeatured: Math.random() > 0.7,
            rating: {
              average: Math.floor(Math.random() * 2) + 4,
              count: Math.floor(Math.random() * 50) + 10
            }
          });

          await product.save();
          totalProducts++;
          categoryStats[category]++;
        }

        console.log(`✓ Created ${products.length} products for ${subcategory}`);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Total products created: ${totalProducts}`);
    console.log('\nProducts by category:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedNewCategoryProducts();
}

module.exports = seedNewCategoryProducts;