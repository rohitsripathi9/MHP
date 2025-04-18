import { request } from "http";
import foodModel from "../models/foodModel.js";
import fs from 'fs'


const addFood = async(req,res)=> {
    let image_filename = `${req.file.filename}`
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category,
    })
    try {
        await food.save();
        res.json({success:true,message:"Food added successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error while adding food item"});
    }
}


const listfood = async(req,res)=>{
   try {
    const food = await foodModel.find();
    res.json({success:true,data:food});
   } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error while listing food item"});
   } 
}


const removefooditem = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.foodid);
        if(food){
            fs.unlink(`uploads/${food.image}`, (err) => {
                if(err) console.log('Error deleting image:', err);
            });
            await foodModel.findByIdAndDelete(req.body.foodid);
            res.json({success:true,message:"Food item removed successfully"});
        } else {
            res.json({success:false,message:"Food item not found"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error while removing food item"});
    }
}   

export {addFood,listfood,removefooditem}

