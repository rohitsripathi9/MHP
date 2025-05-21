import React, { useState, useEffect } from 'react';
import './Feedback.css';
import axios from 'axios';

const Feedback = ({ url }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState('all');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        console.log("Fetching feedback data from admin panel");

        // Try the new endpoint first
        try {
          const response = await axios.get(`${url}/api/all-feedback`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log("Feedback data response:", response.data);

          if (response.data.success) {
            setFeedbacks(response.data.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Error with new endpoint, trying fallback:", err);
        }

        // Fallback to the old endpoint
        const response = await axios.get(`${url}/api/feedback/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setFeedbacks(response.data.data);
        } else {
          setError('Failed to fetch feedback data');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Error fetching feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [url]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleRatingFilter = (e) => {
    setSelectedRating(e.target.value);
  };

  const filteredFeedbacks = selectedRating === 'all'
    ? feedbacks
    : feedbacks.filter(feedback => feedback.rating === parseInt(selectedRating));

  return (
    <div className="feedback-container">
      <h1>Customer Feedback</h1>

      <div className="feedback-filter">
        <label htmlFor="rating-filter">Filter by Rating:</label>
        <select
          id="rating-filter"
          value={selectedRating}
          onChange={handleRatingFilter}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading feedback data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="no-feedback">
          {selectedRating === 'all'
            ? 'No feedback available yet.'
            : `No ${selectedRating}-star feedback available.`}
        </div>
      ) : (
        <div className="feedback-list">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              <div className="rating-badge">
                {renderStars(feedback.rating)}
              </div>
              <div className="feedback-header">
                <div className="customer-info">
                  <h3>{feedback.customerName}</h3>
                  <span className="feedback-date">{formatDate(feedback.date)}</span>
                </div>
              </div>
              <div className="feedback-content">
                <p>{feedback.comment}</p>
              </div>
              <div className="feedback-order-id">
                <small>Order ID: {feedback.orderId}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
