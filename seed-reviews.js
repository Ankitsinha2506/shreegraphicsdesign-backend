const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return seedReviews();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

async function seedReviews() {
  try {
    const Review = require('./models/Review');
    const Product = require('./models/Product');
    const User = require('./models/User');
    
    // Get some products and users
    const products = await Product.find().limit(10);
    const users = await User.find().limit(5);
    
    console.log(`📦 Found ${products.length} products and ${users.length} users`);
    
    if (products.length === 0 || users.length === 0) {
      console.log('❌ Need products and users to create reviews');
      return;
    }
    
    // Sample review data
    const reviewTemplates = [
      {
        rating: 5,
        title: "Excellent quality and fast delivery!",
        comment: "I'm really impressed with the quality of this product. The design is exactly what I was looking for and the delivery was super fast. Highly recommended!"
      },
      {
        rating: 4,
        title: "Good product, minor issues",
        comment: "Overall a good product. The quality is decent and it serves its purpose well. Had some minor issues with the packaging but nothing major."
      },
      {
        rating: 5,
        title: "Perfect for my business needs",
        comment: "This product is exactly what my business needed. The customization options are great and the final result exceeded my expectations."
      },
      {
        rating: 3,
        title: "Average quality",
        comment: "The product is okay but not exceptional. It does what it's supposed to do but I expected a bit more for the price."
      },
      {
        rating: 5,
        title: "Outstanding customer service",
        comment: "Not only is the product great, but the customer service was outstanding. They helped me with customization and were very responsive."
      },
      {
        rating: 4,
        title: "Great value for money",
        comment: "Considering the price, this is a great deal. The quality is good and it arrived on time. Would definitely order again."
      },
      {
        rating: 2,
        title: "Not what I expected",
        comment: "The product didn't match the description completely. The quality is below average and I had to contact support for clarification."
      },
      {
        rating: 5,
        title: "Highly professional work",
        comment: "The team did an amazing job with my custom design. Very professional and the final product looks fantastic. Will definitely use their services again."
      }
    ];
    
    const reviews = [];
    
    // Create reviews for different products and users
    for (let i = 0; i < Math.min(20, products.length * 2); i++) {
      const product = products[i % products.length];
      const user = users[i % users.length];
      const template = reviewTemplates[i % reviewTemplates.length];
      
      reviews.push({
        product: product._id,
        user: user._id,
        rating: template.rating,
        title: template.title,
        comment: template.comment,
        isVerifiedPurchase: Math.random() > 0.3, // 70% verified purchases
        helpfulVotes: Math.floor(Math.random() * 10),
        status: ['approved', 'pending', 'approved', 'approved'][Math.floor(Math.random() * 4)], // Mostly approved
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
    }
    
    // Insert reviews
    console.log(`📝 Creating ${reviews.length} reviews...`);
    
    // Clear existing reviews first
    await Review.deleteMany({});
    console.log('🗑️ Cleared existing reviews');
    
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews successfully!`);
    
    // Show summary
    const statusCounts = await Review.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('📊 Review status summary:', statusCounts);
    
  } catch (error) {
    console.error('❌ Error seeding reviews:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}