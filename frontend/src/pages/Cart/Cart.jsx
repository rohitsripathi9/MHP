import React, { useState } from 'react'
import './Cart.css'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token, isLoading } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      navigate('/');
      return;
    }

    setIsAnimating(true);
    navigate('/order');
  };

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className={`cart ${isAnimating ? 'flying-animation' : ''}`}>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <div className="cart-total-details">
              <p>Platform Fee!</p>
              <p>₹{getTotalCartAmount()===0? 0:2}</p>
            </div>

            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0 ?0:getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button 
            onClick={handleCheckout} 
            className='checkout-button'
            disabled={isAnimating || getTotalCartAmount() === 0 || !token}
          >
            {isAnimating ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart;
