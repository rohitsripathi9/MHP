import mongoose from "mongoose"

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://mhp:rohitjee55@cluster0.bsls3.mongodb.net/mhp').then(()=>console.log("DB Connected"));
}