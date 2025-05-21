import feedbackModel from "../models/feedbackModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Submit feedback
const submitFeedback = async (req, res) => {
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
};

// Get all feedback (for admin)
const getAllFeedback = async (req, res) => {
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
};

// Get feedback for a specific order
const getOrderFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if user is authorized to view feedback for this order
        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view feedback for this order"
            });
        }

        // Get feedback for the order
        const feedback = await feedbackModel.findOne({ orderId }).lean();
        if (!feedback) {
            return res.json({
                success: true,
                data: null,
                message: "No feedback found for this order"
            });
        }

        res.json({
            success: true,
            data: feedback
        });
    } catch (error) {
        console.error("Error getting order feedback:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching order feedback",
            error: error.message
        });
    }
};

export { submitFeedback, getAllFeedback, getOrderFeedback };
