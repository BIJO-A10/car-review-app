import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';

export default function ReviewForm({ carName, onSubmit, onClose }) {
  const [user, setUser] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic frontend checks
    if (!user.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a review title.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write your review comment.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        user: user.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Review {carName}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label" htmlFor="reviewer-name">Your Name</label>
              <input
                id="reviewer-name"
                type="text"
                className="form-input"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="e.g., Jane Doe"
                maxLength={50}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="star-selector-wrapper">
                <StarRating rating={rating} interactive={true} onChange={setRating} size={24} />
                <span className="star-rating-label">({rating} of 5 stars)</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="review-title">Review Title</label>
              <input
                id="review-title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience..."
                maxLength={100}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="review-comment">Review Comments</label>
              <textarea
                id="review-comment"
                className="form-input form-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How does it handle?"
                maxLength={1000}
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
