import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    pickup_time: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:mm format.`
        }
    },
    payment: { type: Boolean, required: true },
    customer_details: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        phone: { type: String, required: true },
        department: { type: String, required: true },
        year: { type: String, required: true },
        section: { type: String, required: true }
    }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema, "orders");
export default orderModel;