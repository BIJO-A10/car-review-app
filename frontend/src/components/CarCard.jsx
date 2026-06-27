import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import StarRating from './StarRating';

export default function CarCard({ car, onClick }) {
  const { make, model, year, category, price, image, rating, reviewCount, description } = car;

  return (
    <div className="car-card slide-up" onClick={onClick}>
      <div className="card-img-wrapper">
        <img 
          src={image} 
          alt={`${make} ${model}`} 
          className="card-img"
          onError={(e) => {
            // Fallback if image doesn't load or copy failed
            e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="card-badge">{category}</span>
      </div>
      
      <div className="card-content">
        <div className="card-title-row">
          <h3 className="card-title">{make} {model}</h3>
          <span className="card-price">{price}</span>
        </div>
        <p className="card-subtitle">{year} model</p>
        
        <div className="card-stats">
          <div className="stat-item rating-item">
            <StarRating rating={rating} />
            <span>{rating > 0 ? rating : 'No rating'}</span>
          </div>
          <div className="stat-item">
            <MessageSquare size={16} />
            <span>{reviewCount} reviews</span>
          </div>
        </div>
        
        <p className="card-description">{description}</p>
        
        <div className="card-footer">
          <span className="view-reviews-link">
            View Reviews <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
