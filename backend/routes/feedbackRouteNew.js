import express from "express";
import jwt from 'jsonwebtoken';
import feedbackModel from "../models/feedbackModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const feedbackRouterNew = express.Router();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.userId = decoded.id;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during authentication"
        });
    }
};

// Submit feedback - new implementation
feedbackRouterNew.post("/submit-feedback", verifyToken, async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const userId = req.userId;

        console.log("Feedback submission request received:", { userId, orderId, rating, comment });

        // Validate input
        if (!orderId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Order ID, rating, and comment are required"
            });
        }

        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if user is authorized to submit feedback for this order
        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to submit feedback for this order"
            });
        }

        // Check if feedback already exists for this order
        const existingFeedback = await feedbackModel.findOne({ orderId });
        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: "Feedback already submitted for this order"
            });
        }

        // Get user details for customer name
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const customerName = user.name || `${order.customer_details.first_name} ${order.customer_details.last_name}`;
        console.log("Using customer name:", customerName);

        // Create new feedback
        const newFeedback = new feedbackModel({
            userId,
            orderId,
            rating,
            comment,
            customerName,
            date: new Date() // Ensure we use the current date
        });

        console.log("Saving feedback:", newFeedback);
        await newFeedback.save();
        console.log("Feedback saved successfully");

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback: newFeedback
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting feedback",
            error: error.message
        });
    }
});

// Get all feedback - new implementation
feedbackRouterNew.get("/all-feedback", async (req, res) => {
    console.log("Request to get all feedback received");
    
    try {
        console.log("Querying feedback database...");
        const feedbacks = await feedbackModel.find()
            .sort({ date: -1 })
            .lean();
        
        console.log(`Found ${feedbacks.length} feedback entries`);
        
        res.json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        console.error("Error getting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching feedback",
            error: error.message
        });
    }
});

export default feedbackRouterNew;
