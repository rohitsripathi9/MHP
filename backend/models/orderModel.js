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
                // First validate the format
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v)) {
                    return false;
                }

                // Then validate the hour range
                const hour = parseInt(v.split(':')[0]);
                return hour >= 7 && hour < 19;
            },
            message: props => {
                const hour = parseInt(props.value.split(':')[0]);
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(props.value)) {
                    return `${props.value} is not a valid time format! Use HH:mm format.`;
                } else if (hour < 7 || hour >= 19) {
                    return `${props.value} is outside allowed hours! Pickup time must be between 7:00 AM and 7:00 PM.`;
                }
                return 'Invalid time format';
            }
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