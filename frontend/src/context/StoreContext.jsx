import { createContext, useEffect } from "react";
export const StoreContext = createContext(null)
import { useState } from "react";
import axios from "axios";

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://mhp-hkp3.onrender.com";
    
    // Initialize token from localStorage
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    const [food_list, setFoodList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up axios defaults when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const addToCart = async (itemId) => {
        try {
            if (!cartItems[itemId]) {
                setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
            }
            else {
                setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
            }
            if (token) {
                await axios.post(url + "/api/cart/add", { itemId })
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const removeFromCart = async (itemId) => {
        try {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
            if (token) {
                await axios.post(url + "/api/cart/remove", { itemId })
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    const getTotalCartAmount = () => {
        try {
            let totalAmount = 0;
            if (!food_list || food_list.length === 0) return 0;
            
            for (const itemId in cartItems) {
                if (cartItems[itemId] > 0) {
                    const itemInfo = food_list.find((product) => product._id === itemId);
                    if (itemInfo && itemInfo.price) {
                        totalAmount += itemInfo.price * cartItems[itemId];
                    }
                }
            }
            return totalAmount;
        } catch (error) {
            console.error("Error calculating cart total:", error);
            return 0;
        }
    }

    const loadCartdata = async () => {
        try {
            setIsLoading(true);
            if (!token) {
                setCartItems({});
                return;
            }
            const response = await axios.get(url + "/api/cart/get");
            if (response.data.success) {
                setCartItems(response.data.data);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchFoodList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
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
                setCartItems({}); // Clear cart when logging out
            }
            setToken(newToken);
        },
        isLoading,
        error
    }

    return (
        <StoreContext.Provider value={contextValue}> {props.children}</StoreContext.Provider>
    )
}

export default StoreContextProvider;
