import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FeedbackInvitation.css';
import FeedbackForm from '../FeedbackForm/FeedbackForm';

const FeedbackInvitation = ({ orderId, onFeedbackSubmitted }) => {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmitted = () => {
    // Call the parent callback after submission
    if (onFeedbackSubmitted) {
      onFeedbackSubmitted();
    }
  };

  return (
    <div className="feedback-invitation-container">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            className="feedback-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            key="prompt"
          >
            <div className="feedback-stars-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  className="feedback-star"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 * star,
                    ease: "easeOut"
                  }}
                >
                  ★
                </motion.span>
              ))}
            </div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              How was your experience?
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="feedback-subtitle"
            >
              Your feedback helps us improve our service
            </motion.p>

            <motion.button
              className="feedback-start-button"
              onClick={() => setShowForm(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Rate Now
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="feedback-form-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            key="form"
          >
            <FeedbackForm
              orderId={orderId}
              onFeedbackSubmitted={handleFormSubmitted}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackInvitation;
