import { useState } from "react";

function StarRating({ movieId, value, onRate }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star ${display >= star ? "filled" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(movieId, star)}
          title={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
