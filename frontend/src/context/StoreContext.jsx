import { createContext, useEffect } from "react";
export const StoreContext = createContext(null)
import { useState } from "react";
import axios from "axios";

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    
    // Initialize token from localStorage
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    const [food_list, setFoodList] = useState([]);

    // Set up axios defaults when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const loadCartdata = async () => {
        try {
            if (!token) return;
            const response = await axios.get(url + "/api/cart/get");
            if (response.data.success) {
                setCartItems(response.data.data);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await loadCartdata();
        }
        loadData();
    }, [token]) // Reload when token changes

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token, 
        setToken: (newToken) => {
            if (newToken) {
                localStorage.setItem("token", newToken);
            } else {
                localStorage.removeItem("token");
            }
            setToken(newToken);
        }
    }

    return (
        <StoreContext.Provider value={contextValue}> {props.children}</StoreContext.Provider>
    )
}

export default StoreContextProvider;
