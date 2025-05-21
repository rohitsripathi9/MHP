import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import FeedbackInvitation from '../../components/FeedbackInvitation/FeedbackInvitation';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [stage, setStage] = useState('loading'); // loading, success, feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || localStorage.getItem('lastOrderId') || '';

  useEffect(() => {
    // Show loading for 2 seconds
    setTimeout(() => {
      setStage('success');
    }, 2000);
  }, []);

  const handleReturnHome = () => {
    navigate('/myorders');
  };

  const handleRateExperience = () => {
    setShowFeedback(true);
    setStage('feedback');
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedback(false);
    setStage('success');
    // Show a thank you message or notification
    alert('Thank you for your feedback!');
  };

  return (
    <div className="payment-success-container">
      {stage === 'loading' ? (
        <motion.div
          className="payment-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="loading-ring">
            <div></div><div></div><div></div><div></div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Processing Payment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Please wait while we confirm your payment...
          </motion.p>
        </motion.div>
      ) : stage === 'feedback' ? (
        <motion.div
          className="payment-card feedback-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FeedbackInvitation
            orderId={orderId}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        </motion.div>
      ) : (
        <motion.div
          className="payment-card success-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="success-icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <div className="success-icon">
              <motion.svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <motion.circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <motion.path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </motion.svg>
            </div>
          </motion.div>
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <motion.div
              className="amount-paid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <h2>Payment Successful!</h2>
              <div className="success-icon-small">✓</div>
            </motion.div>
            <p className="thank-you">Thank you for choosing us</p>

            <div className="success-buttons">
              <motion.button
                className="rate-experience-btn"
                onClick={handleRateExperience}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Rate Your Experience
              </motion.button>

              <motion.button
                className="return-home-btn"
                onClick={handleReturnHome}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Orders
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentSuccess;