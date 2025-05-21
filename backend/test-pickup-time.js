import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderModel from './models/orderModel.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const testPickupTimeValidation = async () => {
  try {
    console.log('Testing pickup time validation...');
    
    // Test cases for pickup times
    const testCases = [
      { time: '06:30', expected: false, reason: 'Before 7 AM' },
      { time: '07:00', expected: true, reason: 'Exactly 7 AM' },
      { time: '12:30', expected: true, reason: 'Middle of the day' },
      { time: '18:59', expected: true, reason: 'Just before 7 PM' },
      { time: '19:00', expected: false, reason: 'Exactly 7 PM' },
      { time: '20:15', expected: false, reason: 'After 7 PM' },
      { time: 'invalid', expected: false, reason: 'Invalid format' }
    ];
    
    for (const testCase of testCases) {
      // Create a test order
      const testOrder = new orderModel({
        userId: '123456789012345678901234',
        items: [{ name: 'Test Item', price: 10, quantity: 1 }],
        amount: 10,
        pickup_time: testCase.time,
        payment: false,
        customer_details: {
          first_name: 'Test',
          last_name: 'User',
          phone: '1234567890',
          department: 'Test',
          year: '1',
          section: 'A'
        }
      });
      
      // Validate the order
      try {
        await testOrder.validate();
        console.log(`✅ Time ${testCase.time} (${testCase.reason}): Validation passed as expected: ${testCase.expected}`);
      } catch (error) {
        if (!testCase.expected) {
          console.log(`✅ Time ${testCase.time} (${testCase.reason}): Validation failed as expected: ${error.message}`);
        } else {
          console.log(`❌ Time ${testCase.time} (${testCase.reason}): Validation failed unexpectedly: ${error.message}`);
        }
      }
    }
    
    console.log('Pickup time validation test completed');
  } catch (error) {
    console.error('Error testing pickup time validation:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

testPickupTimeValidation();
