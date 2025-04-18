import React, { useEffect, useState } from 'react';
import './Order.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${url}/api/order/all-orders`);
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [url]);

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
      const orderDate = new Date(dateString);
      const formattedDate = orderDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

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
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>All Orders</h1>
      <div className="orders-list">
        {!orders || orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
          </div>
        ) : (
          orders.map((order) => {
            const status = getOrderStatus(order);
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="customer-details">
                    <h3>{order.customer_details?.first_name} {order.customer_details?.last_name}</h3>
                    <p>Department: {order.customer_details?.department}</p>
                    <p>Year: {order.customer_details?.year}, Section: {order.customer_details?.section}</p>
                    <p>Phone: {order.customer_details?.phone}</p>
                  </div>
                  <div className="order-status">
                    <div className={`status-container ${status.isDelivered ? 'delivered' : 'confirmed'}`}>
                      {status.isDelivered ? (
                        <>
                          <span className="status-icon">✓</span>
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
                </div>
                <div className="order-content">
                  <div className="order-details">
                    <p className="order-items">
                      {formatOrderItems(order.items)}
                    </p>
                  </div>
                  <div className="order-meta">
                    <div className="order-price">
                      ₹{(order.amount || 0).toFixed(2)}
                    </div>
                    <div className="order-info">
                      <span>Items: {getTotalItems(order.items)}</span>
                    </div>
                  </div>
                </div>
                <div className="pickup-time">
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

export default Order;