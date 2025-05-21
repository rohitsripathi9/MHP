import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    customerName: { type: String, required: true }
});

const feedbackModel = mongoose.models.feedback || mongoose.model("feedback", feedbackSchema, "feedbacks");
export default feedbackModel;
