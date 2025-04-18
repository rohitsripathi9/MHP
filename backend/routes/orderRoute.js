import express from "express";
import authMiddleware from "../middleware/auth.js";        
import { placeOrder, updateOrderStatus, verifyPayment, userOrders, getAllOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/update-status", authMiddleware, updateOrderStatus);
orderRouter.post("/verify", authMiddleware, verifyPayment);
orderRouter.post("/user-orders", authMiddleware, userOrders);
orderRouter.get("/all-orders", getAllOrders);

export default orderRouter;