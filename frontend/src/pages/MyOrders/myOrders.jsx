import React, { useEffect, useState, useContext } from 'react';
import './myOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${url}/api/order/user-orders`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          console.error('Failed to fetch orders:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, url, navigate]);

  const formatOrderItems = (items) => {
    if (!items || !Array.isArray(items)) return '';
    return items.map(item => `${item.name} × ${item.quantity}`).join(', ');
  };

  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
  };

  const formatDateTime = (timeString, dateString) => {
    if (!timeString) return 'Not specified';
    
    try {
      // Format the date
      const orderDate = new Date(dateString);
      const formattedDate = orderDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Format the time
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      const formattedTime = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      return timeString;
    }
  };

  const getOrderStatus = (order) => {
    if (!order?.date || !order?.pickup_time) {
      return { 
        text: 'Order Confirmed', 
        isDelivered: false
      };
    }

    try {
      const orderDate = new Date(order.date);
      const [hours, minutes] = order.pickup_time.split(':');
      
      if (!hours || !minutes) {
        return { 
          text: 'Order Confirmed',
          isDelivered: false
        };
      }

      const now = new Date();
      const oneDayAfterOrder = new Date(orderDate);
      oneDayAfterOrder.setDate(oneDayAfterOrder.getDate() + 1);

      if (now > oneDayAfterOrder) {
        return { 
          text: 'Delivered',
          isDelivered: true
        };
      }
      
      return { 
        text: 'Order Confirmed',
        isDelivered: false
      };
    } catch (error) {
      console.error('Error processing order status:', error);
      return { 
        text: 'Order Confirmed',
        isDelivered: false
      };
    }
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {!orders || orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => {
            const status = getOrderStatus(order);
            return (
              <div key={order._id} className="order-card">
                <div className="order-box">
                  <img src={assets.box_icon} alt="Order Box" className="box-icon" />
                </div>
                <div className="order-details">
                  <p className="order-items">
                    {formatOrderItems(order.items)}
                  </p>
                </div>
                <div className="order-price">
                  ₹{(order.amount || 0).toFixed(2)}
                </div>
                <div className="order-info">
                  <span>Items: {getTotalItems(order.items)}</span>
                  <div className={`status-container ${status.isDelivered ? 'delivered' : 'confirmed'}`}>
                    {status.isDelivered ? (
                      <>
                        {/* Dot will be added via CSS */}
                        <span className="status-text">{status.text}</span> 
                      </>
                    ) : (
                      <>
                        <div className="status-dot-container">
                          <span className="status-dot"></span>
                          <span className="status-dot"></span>
                          <span className="status-dot"></span>
                        </div>
                        <span className="status-text">{status.text}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`pickup-time ${order.pickup_time ? 'has-time' : 'no-time'}`}>
                  <div className="time-label">PICKUP TIME</div>
                  <div className="time-value">
                    {formatDateTime(order.pickup_time, order.date)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
