import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, interactive = false, onChange, size = 18 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  // Determine which rating value to use for display
  const displayRating = hoverRating || rating;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= Math.round(displayRating);

        return (
          <button
            key={starIndex}
            type="button"
            className={`star-rating-btn ${interactive ? 'interactive' : ''} ${isFilled ? 'active' : ''}`}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
            title={interactive ? `Rate ${starIndex} Stars` : `${rating} Stars`}
          >
            <Star
              size={size}
              strokeWidth={2}
              fill={isFilled ? 'currentColor' : 'transparent'}
            />
          </button>
        );
      })}
    </div>
  );
}
