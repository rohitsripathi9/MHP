import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';

// Make sure the Stripe key is properly loaded
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' // Specify the API version
});

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        // Log the entire request for debugging
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("UserId from middleware:", req.userId);
        console.log("Pickup time from request:", req.body.pickup_time);

        if (!req.body.userId && !req.userId) {
            throw new Error("User not authenticated");
        }

        if (!req.body.pickup_time) {
            throw new Error("Pickup time is required");
        }

        // Validate pickup time is between 7 AM and 7 PM
        const [hours, minutes] = req.body.pickup_time.split(':');
        const pickupHour = parseInt(hours);

        if (pickupHour < 7 || pickupHour >= 19) {
            throw new Error("Pickup time must be between 7:00 AM and 7:00 PM");
        }

        const userId = req.userId || req.body.userId;
        console.log("Using userId:", userId);

        // Create new order
        const neworder = new orderModel({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount,
            customer_details: req.body.customer_details,
            pickup_time: req.body.pickup_time,
            payment: false,
            status: "Order Confirmed"
        });

        console.log("Creating order with pickup time:", req.body.pickup_time);
        const savedOrder = await neworder.save();
        console.log("Order saved successfully:", savedOrder);

        // Verify the saved order has pickup_time
        const verifiedOrder = await orderModel.findById(savedOrder._id);
        console.log("Verified saved order:", verifiedOrder);

        // Create Stripe session
        const line_items = req.body.items.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : [],
                        description: `Quantity: ${item.quantity}`
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to paise and ensure it's an integer
                },
                quantity: item.quantity,
            };
        });

        // Add platform fee
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Platform fee",
                    description: "Processing and handling fee"
                },
                unit_amount: 200, // 2 rupees in paise
            },
            quantity: 1,
        });

        console.log("Creating Stripe session with line items:", line_items);

        // Create Stripe checkout session with additional configurations
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${savedOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${savedOrder._id}`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
            customer_email: req.body.customer_details?.email,
            metadata: {
                orderId: savedOrder._id.toString(),
                userId: userId
            },
            payment_intent_data: {
                metadata: {
                    orderId: savedOrder._id.toString(),
                    userId: userId
                }
            }
        });

        console.log("Stripe session created successfully:", session.id);

        // Clear cart after successful order creation
        await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });

        res.json({
            success: true,
            message: "Order placed successfully",
            session_url: session.url,
            session_id: session.id
        });
    } catch (error) {
        console.error("Order placement error:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(400).json({
            success: false,
            message: error.message || "Error while placing order"
        });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;

        console.log("Updating order status:", { orderId, paymentStatus });

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // First get the existing order
        const existingOrder = await orderModel.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        console.log("Existing order:", existingOrder);

        // Update the order while preserving existing fields
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            {
                payment: paymentStatus,
                status: paymentStatus ? "Order Confirmed" : "Payment Failed",
                pickup_time: existingOrder.pickup_time // Explicitly preserve pickup time
            },
            {
                new: true, // Return the updated document
                runValidators: true // Run model validators
            }
        );

        console.log("Updated order:", updatedOrder);

        res.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating order status"
        });
    }
}

const verifyPayment = async (req, res) => {
    const { orderId, success, pickup_time } = req.body;
    try {
        if(success === "true") {
            const existingOrder = await orderModel.findById(orderId);
            if (!existingOrder) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            console.log("Existing order before payment verification:", existingOrder);

            // Use the pickup time from the request or keep the existing one
            const updatedPickupTime = pickup_time || existingOrder.pickup_time;
            console.log("Using pickup time:", updatedPickupTime);

            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId,
                {
                    payment: true,
                    status: "Order Confirmed",
                    pickup_time: updatedPickupTime
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            console.log("Order after payment verification:", updatedOrder);

            res.json({
                success: true,
                message: "Payment verified successfully",
                order: updatedOrder
            });
        } else {
            const existingOrder = await orderModel.findById(orderId);
            if (existingOrder) {
                const updatedOrder = await orderModel.findByIdAndUpdate(
                    orderId,
                    {
                        payment: false,
                        status: "Payment Failed",
                        pickup_time: pickup_time || existingOrder.pickup_time
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                console.log("Order after payment failure:", updatedOrder);
            }
            res.json({
                success: false,
                message: "Payment failed"
            });
        }
    } catch(error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
}

//get all orders
const userOrders = async (req, res) => {
    try {
        // Get all orders for the user
        const orders = await orderModel.find(
            { userId: req.userId },
            {
                userId: 1,
                items: 1,
                amount: 1,
                status: 1,
                date: 1,
                pickup_time: 1,
                payment: 1,
                customer_details: 1
            }
        )
        .sort({ date: -1 })
        .lean();

        if (!orders || orders.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
}

//get all orders for admin
const getAllOrders = async (req, res) => {
    try {
        // Get all orders
        const orders = await orderModel.find()
        .sort({ date: -1 })
        .lean();

        if (!orders || orders.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error getting all orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
}

export { placeOrder, updateOrderStatus, verifyPayment, userOrders, getAllOrders };