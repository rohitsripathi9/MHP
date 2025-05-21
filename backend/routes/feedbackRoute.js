import express from "express";
import authMiddleware from "../middleware/auth.js";
import { submitFeedback, getAllFeedback, getOrderFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/submit", authMiddleware, submitFeedback);
feedbackRouter.get("/all", getAllFeedback);
feedbackRouter.get("/order/:orderId", authMiddleware, getOrderFeedback);

export default feedbackRouter;
