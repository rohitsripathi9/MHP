import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";

//app config 
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//db connection 
connectDB();

// api endpoints 
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found'
    });
});

app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`);
});