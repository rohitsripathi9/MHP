import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.json({ success: false, message: "userId and itemId are required" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!userData.cartData) {
            userData.cartData = {};
        }

        let cartData = userData.cartData;

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.log("Add to Cart Error:", error);
        return res.json({ success: false, message: "Error while adding to cart" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.json({ success: false, message: "userId and itemId are required" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (cartData[itemId] && cartData[itemId] > 0) {
            cartData[itemId] -= 1;

            if (cartData[itemId] === 0) {
                delete cartData[itemId]; // Optional: remove key if qty is 0
            }

            await userModel.findByIdAndUpdate(userId, { cartData });
            return res.json({ success: true, message: "Item removed from cart" });
        } else {
            return res.json({ success: false, message: "Item not found in cart or quantity is zero" });
        }
    } catch (error) {
        console.log("Remove From Cart Error:", error);
        return res.json({ success: false, message: "Error while removing from cart" });
    }
};



const getCart = async (req, res) => {
    try{
        let userData  = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,message:"Cart fetched successfully",data:cartData});


    }  
    catch(error){
        console.log("Get Cart Error:",error);
        return res.json({success:false,message:"Error while getting cart"});
    }

}

export { addToCart, removeFromCart, getCart };