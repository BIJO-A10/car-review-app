import React from 'react';
import { X, Cpu, Gauge, Zap, Compass, MessageSquare, Plus } from 'lucide-react';
import StarRating from './StarRating';

export default function CarDetails({ car, onClose, onAddReviewClick }) {
  if (!car) return null;

  const { make, model, year, category, price, image, rating, reviewCount, specs, description, reviews = [] } = car;

  return (
    <div className="details-overlay">
      <div className="details-container">
        <button className="details-close-btn" onClick={onClose} aria-label="Close details">
          <X size={20} />
        </button>
        
        <div className="details-hero">
          <img 
            src={image} 
            alt={`${make} ${model}`} 
            className="details-hero-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="details-hero-overlay">
            <span className="details-category">{category}</span>
            <div className="details-title-row">
              <h2 className="details-name">{make} {model}</h2>
              <span className="details-price">Starting at {price}</span>
            </div>
          </div>
        </div>
        
        <div className="details-body">
          {/* Tech Specs */}
          <h3 className="specs-title">
            <Cpu size={18} className="spec-icon" /> Technical Specifications
          </h3>
          <div className="specs-grid">
            <div className="spec-card">
              <Cpu size={20} className="spec-icon" />
              <span className="spec-label">Power</span>
              <span className="spec-value">{specs.horsepower}</span>
            </div>
            <div className="spec-card">
              <Gauge size={20} className="spec-icon" />
              <span className="spec-label">0-60 MPH</span>
              <span className="spec-value">{specs.acceleration}</span>
            </div>
            <div className="spec-card">
              <Zap size={20} className="spec-icon" />
              <span className="spec-label">Efficiency / Range</span>
              <span className="spec-value">{specs.range_or_mpg}</span>
            </div>
            <div className="spec-card">
              <Compass size={20} className="spec-icon" />
              <span className="spec-label">Drivetrain</span>
              <span className="spec-value">{specs.drivetrain}</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="details-description-section">
            <h3 className="details-desc-title">Overview</h3>
            <p className="details-desc-text">{description}</p>
          </div>
          
          {/* Reviews list */}
          <div className="reviews-section">
            <div className="reviews-section-header">
              <div className="reviews-summary">
                <h3 className="reviews-section-title">User Reviews</h3>
                {reviewCount > 0 && (
                  <div className="summary-score-box">
                    <span className="summary-score">{rating}</span>
                    <StarRating rating={rating} size={14} />
                    <span className="summary-count">({reviewCount})</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={onAddReviewClick}>
                <Plus size={16} /> Write a Review
              </button>
            </div>
            
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="review-item slide-up">
                    <div className="review-item-header">
                      <div className="review-author-info">
                        <span className="review-author">{review.user}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating-row">
                        <StarRating rating={review.rating} size={14} />
                      </div>
                    </div>
                    <h4 className="review-item-title">{review.title}</h4>
                    <p className="review-item-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews-prompt">
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                  <button className="btn btn-secondary" onClick={onAddReviewClick}>
                    Write the First Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
