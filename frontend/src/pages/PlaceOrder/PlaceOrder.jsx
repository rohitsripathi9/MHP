import React, { useState, useEffect } from 'react'
import "./PlaceOrder.css"
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
    year: "",
    section: "",
    pickup_time: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      navigate('/');
      return;
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [token, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;  
    const value = event.target.value;
    setData(data => ({...data, [name]: value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        // Check if token exists
        if (!token) {
            setError("Please login to place an order");
            setIsLoading(false);
            return;
        }

        // Validate pickup time
        if (!data.pickup_time) {
            setError("Please select a pickup time");
            setIsLoading(false);
            return;
        }

        const currentTime = new Date();
        const [hours, minutes] = data.pickup_time.split(':');
        const pickupTime = new Date();
        pickupTime.setHours(parseInt(hours), parseInt(minutes), 0);

        // If pickup time is earlier than current time, reject it
        if (pickupTime < currentTime) {
            const currentHours = currentTime.getHours().toString().padStart(2, '0');
            const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0');
            setError(`Cannot select a past time. Current time is ${currentHours}:${currentMinutes}`);
            setIsLoading(false);
            return;
        }

        // Ensure pickup time is at least 5 minutes from now
        const minPickupTime = new Date(currentTime.getTime() + 5 * 60000);
        if (pickupTime < minPickupTime) {
            const nextHours = minPickupTime.getHours().toString().padStart(2, '0');
            const nextMinutes = minPickupTime.getMinutes().toString().padStart(2, '0');
            setError(`Please select a pickup time after ${nextHours}:${nextMinutes} (at least 5 minutes from now)`);
            setIsLoading(false);
            return;
        }

        // Format pickup time as HH:mm
        const formattedPickupTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        console.log('Formatted pickup time:', formattedPickupTime);

        // Extract userId from token
        let userId;
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id;
        } catch (error) {
            setError("Invalid token. Please login again.");
            setIsLoading(false);
            return;
        }
        
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = {...item};
                itemInfo.quantity = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        if (orderItems.length === 0) {
            setError("Your cart is empty. Please add items before placing an order.");
            setIsLoading(false);
            return;
        }

        let orderData = {
            userId: userId,
            customer_details: {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                department: data.department,
                year: data.year,
                section: data.section
            },
            items: orderItems,
            amount: getTotalCartAmount() + 2,
            payment: false,
            pickup_time: formattedPickupTime
        }

        console.log("Sending order data:", JSON.stringify(orderData, null, 2));
        
        const response = await axios.post(`${url}/api/order/place`, orderData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log("Order response:", response.data);
        
        if (response.data.success && response.data.session_url) {
            // Store pickup time in localStorage before redirecting
            localStorage.setItem('pending_order_pickup_time', formattedPickupTime);
            
            const { session_url } = response.data;
            console.log("Redirecting to Stripe:", session_url);
            window.location.replace(session_url);
        } else {
            console.error("Failed to get Stripe session URL:", response.data);
            setError(response.data.message || "Something went wrong with the payment process");
            setIsLoading(false);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        setError(error.response?.data?.message || "Error while placing order. Please try again.");
        setIsLoading(false);
    }
  }

  const [isFlying, setIsFlying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="place-order-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <form onSubmit={placeOrder} className="order-content">
        <motion.div 
          className="order-section"
          variants={childVariants}
        >
          <motion.div 
            className="information-section"
            variants={childVariants}
          >
            <h2>Information</h2>
            {error && (
              <div className="error-message" style={{color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '5px'}}>
                {error}
              </div>
            )}
            <div className="form-grid">
              <div className="form-group">
                <motion.input 
                  name="first_name"
                  required
                  onChange={onChangeHandler}
                  value={data.first_name}
                  whileFocus={{ scale: 1.02 }}
                  type="text" 
                  placeholder="Enter first name"
                  className="input-animate"
                  id="firstName"
                />
                <label htmlFor="firstName">First Name</label>
              </div>
              
              <div className="form-group">
                <motion.input 
                  name="last_name"
                  required
                  onChange={onChangeHandler}
                  value={data.last_name}
                  whileFocus={{ scale: 1.02 }}
                  type="text" 
                  placeholder="Enter last name"
                  className="input-animate"
                  id="lastName"
                />
                <label htmlFor="lastName">Last Name</label>
              </div>

              <div className="form-group">
                <motion.input 
                  name="phone"
                  required
                  onChange={onChangeHandler}
                  value={data.phone}
                  whileFocus={{ scale: 1.02 }}
                  type="tel" 
                  placeholder="Enter phone number"
                  className="input-animate"
                  id="phone"
                  pattern="[0-9]{10}"
                />
                <label htmlFor="phone">Phone Number</label>
              </div>

              <div className="form-group">
                <motion.input 
                  name="pickup_time"
                  required
                  onChange={onChangeHandler}
                  value={data.pickup_time}
                  whileFocus={{ scale: 1.02 }}
                  type="time" 
                  className="input-animate"
                  id="pickupTime"
                  min="07:00"
                  max="19:00"
                />
                <label htmlFor="pickupTime">Pickup Time (7 AM - 7 PM)</label>
              </div>

              <div className="form-group">
                <motion.input 
                  name="department"
                  required
                  onChange={onChangeHandler}
                  value={data.department}
                  whileFocus={{ scale: 1.02 }}
                  type="text" 
                  placeholder="Enter department"
                  className="input-animate"
                  id="department"
                />
                <label htmlFor="department">Department</label>
              </div>

              <div className="form-group">
                <motion.input 
                  name="year"
                  required
                  onChange={onChangeHandler}
                  value={data.year}
                  whileFocus={{ scale: 1.02 }}
                  type="text" 
                  placeholder="Enter year"
                  className="input-animate"
                  id="year"
                />
                <label htmlFor="year">Year</label>
              </div>

              <div className="form-group">
                  <motion.input 
                  name="section"
                  required
                  onChange={onChangeHandler}
                  value={data.section}
                  whileFocus={{ scale: 1.02 }}
                  type="text" 
                  placeholder="Enter section"
                  className="input-animate"
                  id="section"
                />
                <label htmlFor="section">Section</label>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="cart-totals-section"
            variants={childVariants}
          >
            <h2>Cart Totals</h2>
            <motion.div 
              className="totals-details"
              variants={childVariants}
            >
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className="total-row">
                <span>Platform Fee</span>
                <span>₹{getTotalCartAmount() === 0 ? 0 : 2}</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</span>
              </div>
            </motion.div>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`animated-button ${isFlying ? 'flying' : ''}`}
              disabled={isLoading || getTotalCartAmount() === 0}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </motion.button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default PlaceOrder
