import mongoose from 'mongoose';
import dotenv from 'dotenv';
import feedbackModel from './models/feedbackModel.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const testFeedbackSystem = async () => {
  try {
    console.log('Testing feedback system with envelope animation...');
    
    // Check if feedback model exists
    console.log('Checking feedback model...');
    const feedbackCount = await feedbackModel.countDocuments();
    console.log(`Found ${feedbackCount} feedback entries in the database`);
    
    // Create sample feedback entries if none exist
    if (feedbackCount === 0) {
      console.log('Creating sample feedback entries...');
      
      const sampleFeedbacks = [
        {
          userId: '123456789012345678901234',
          orderId: '123456789012345678901234',
          rating: 5,
          comment: 'Excellent food and service! The delivery was on time and the food was still hot.',
          customerName: 'John Doe',
          date: new Date()
        },
        {
          userId: '123456789012345678901235',
          orderId: '123456789012345678901235',
          rating: 4,
          comment: 'Great experience, will order again. The food was delicious but took a bit longer than expected.',
          customerName: 'Jane Smith',
          date: new Date()
        },
        {
          userId: '123456789012345678901236',
          orderId: '123456789012345678901236',
          rating: 5,
          comment: 'Best campus food I\'ve had! The packaging was eco-friendly too.',
          customerName: 'Alex Johnson',
          date: new Date()
        },
        {
          userId: '123456789012345678901237',
          orderId: '123456789012345678901237',
          rating: 3,
          comment: 'Food was good but could be better. The portion size was smaller than expected.',
          customerName: 'Sam Wilson',
          date: new Date()
        },
        {
          userId: '123456789012345678901238',
          orderId: '123456789012345678901238',
          rating: 4,
          comment: 'Tasty food, reasonable prices. Would recommend to friends.',
          customerName: 'Emily Davis',
          date: new Date()
        }
      ];
      
      // Save the sample feedback entries
      await feedbackModel.insertMany(sampleFeedbacks);
      console.log('Sample feedback entries created successfully');
      
      // Verify the entries were saved
      const newCount = await feedbackModel.countDocuments();
      console.log(`Now there are ${newCount} feedback entries in the database`);
    }
    
    // Retrieve all feedback entries
    const allFeedback = await feedbackModel.find().sort({ date: -1 }).limit(10);
    console.log('Recent feedback entries:');
    allFeedback.forEach((feedback, index) => {
      console.log(`\nFeedback #${index + 1}:`);
      console.log(`Customer: ${feedback.customerName}`);
      console.log(`Rating: ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}`);
      console.log(`Comment: ${feedback.comment}`);
      console.log(`Date: ${feedback.date}`);
    });
    
    console.log('\nFeedback system test completed successfully');
  } catch (error) {
    console.error('Error testing feedback system:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

testFeedbackSystem();
