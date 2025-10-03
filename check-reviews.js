const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return checkReviews();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

async function checkReviews() {
  try {
    // Import the Review model
    const Review = require('./models/Review');
    
    // Count total reviews
    const totalReviews = await Review.countDocuments();
    console.log(`📊 Total reviews in database: ${totalReviews}`);
    
    if (totalReviews > 0) {
      // Get a sample review
      const sampleReview = await Review.findOne().populate('user', 'name email').populate('product', 'name');
      console.log('📝 Sample review:', {
        id: sampleReview._id,
        rating: sampleReview.rating,
        title: sampleReview.title,
        user: sampleReview.user?.name || 'Unknown',
        product: sampleReview.product?.name || 'Unknown',
        status: sampleReview.status,
        createdAt: sampleReview.createdAt
      });
      
      // Count by status
      const statusCounts = await Review.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      console.log('📈 Reviews by status:', statusCounts);
    }
    
    // Test the getAllReviews function
    console.log('\n🧪 Testing getAllReviews function...');
    const { getAllReviews } = require('./controllers/reviewController');
    
    // Mock request and response objects
    const mockReq = {
      query: { page: 1, limit: 10 }
    };
    
    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('✅ getAllReviews response:', {
          status: this.statusCode,
          dataKeys: Object.keys(data),
          reviewsCount: data.data?.reviews?.length || 0,
          statusCounts: data.data?.statusCounts
        });
        return this;
      }
    };
    
    await getAllReviews(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Error checking reviews:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}