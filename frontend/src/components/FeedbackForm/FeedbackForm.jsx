import React, { useState } from 'react';
import './FeedbackForm.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const FeedbackForm = ({ orderId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const url = "http://localhost:4000";
  const token = localStorage.getItem('token');
  
  const handleRatingClick = (value) => {
    setRating(value);
  };
  
  const handleRatingHover = (value) => {
    setHoverRating(value);
  };
  
  const handleRatingLeave = () => {
    setHoverRating(0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please provide feedback');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting feedback with data:", { orderId, rating, comment });
      console.log("Using token:", token ? "Yes (token exists)" : "No (token missing)");
      console.log("API URL:", `${url}/api/submit-feedback`);
      
      // Try the new endpoint first
      const response = await axios.post(
        `${url}/api/submit-feedback`,
        {
          orderId,
          rating,
          comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Feedback submission response:", response.data);
      
      if (response.data.success) {
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } else {
        setError(response.data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Show a more detailed error message
      let errorMessage = 'Error submitting feedback. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status} - ${error.response.statusText}`;
        console.error("Response error data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Request error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="feedback-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Rate Your Experience</h2>
      <p className="feedback-subtitle">Your feedback helps us improve our service</p>
      
      <form onSubmit={handleSubmit}>
        <div className="rating-container" onMouseLeave={handleRatingLeave}>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={`star ${value <= (hoverRating || rating) ? 'active' : ''}`}
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => handleRatingHover(value)}
            >
              ★
            </span>
          ))}
        </div>
        
        <div className="feedback-comment">
          <label htmlFor="comment">Your Feedback</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
          />
        </div>
        
        {error && <div className="feedback-error">{error}</div>}
        
        <button 
          type="submit" 
          className="submit-feedback-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
