import mongoose from 'mongoose';
import dotenv from 'dotenv';
import feedbackModel from './models/feedbackModel.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const testFeedback = async () => {
  try {
    console.log('Testing feedback system...');
    
    // Check if feedback model exists
    console.log('Checking feedback model...');
    const feedbackCount = await feedbackModel.countDocuments();
    console.log(`Found ${feedbackCount} feedback entries in the database`);
    
    // Create a test feedback entry
    console.log('Creating test feedback entry...');
    const testFeedback = new feedbackModel({
      userId: '123456789012345678901234',
      orderId: '123456789012345678901234',
      rating: 5,
      comment: 'This is a test feedback entry',
      customerName: 'Test User',
      date: new Date()
    });
    
    // Save the test feedback
    await testFeedback.save();
    console.log('Test feedback saved successfully');
    
    // Retrieve the test feedback
    const savedFeedback = await feedbackModel.findOne({ 
      userId: '123456789012345678901234',
      orderId: '123456789012345678901234'
    });
    console.log('Retrieved test feedback:', savedFeedback);
    
    // Delete the test feedback
    await feedbackModel.deleteOne({ 
      userId: '123456789012345678901234',
      orderId: '123456789012345678901234'
    });
    console.log('Test feedback deleted successfully');
    
    console.log('Feedback system test completed successfully');
  } catch (error) {
    console.error('Error testing feedback system:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

testFeedback();
