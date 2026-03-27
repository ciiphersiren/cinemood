import { useEffect, useState } from "react";
import StarRating from "./StarRating";

function MovieModal({ movie, userRating, onRate, onClose, onSelectMovie, ratings }) {
  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      setSimilar([]);
      try {
        const res = await fetch(`http://localhost:5000/api/similar/${movie.id}`);
        const data = await res.json();
        setSimilar(data.results || []);
      } catch (e) {
        console.error("Similar fetch failed:", e);
      } finally {
        setLoadingSimilar(false);
      }
    };
    fetchSimilar();
  }, [movie.id]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSimilarClick = (m) => {
    onSelectMovie(m);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        {/* Backdrop image */}
        <div className="modal-backdrop">
          {movie.poster ? (
            <img className="modal-backdrop-img" src={movie.poster} alt={movie.title} />
          ) : (
            <div className="modal-backdrop-placeholder">🎬</div>
          )}
          <div className="modal-backdrop-gradient" />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>

          <div className="modal-meta-row">
            {movie.release_year && <span>{movie.release_year}</span>}
            {movie.tmdb_rating > 0 && (
              <span className="modal-score">★ {movie.tmdb_rating.toFixed(1)} / 10</span>
            )}
            {movie.sentiment_score !== undefined && (
              <span style={{ color: "var(--text2)" }}>
                sentiment score: {movie.sentiment_score > 0 ? "+" : ""}{movie.sentiment_score}
              </span>
            )}
          </div>

          {movie.overview && (
            <p className="modal-overview">{movie.overview}</p>
          )}

          {/* User rating */}
          <p className="modal-rate-label">
            {userRating ? `Your rating: ${userRating}/5` : "Rate this film:"}
          </p>
          <div className="modal-stars">
            <StarRating movieId={movie.id} value={userRating || 0} onRate={onRate} />
          </div>

          {/* Similar movies */}
          <p className="modal-section-title">More Like This</p>
          {loadingSimilar && (
            <p style={{ fontSize: "13px", color: "var(--text2)" }}>Loading similar films...</p>
          )}
          {!loadingSimilar && similar.length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--text2)" }}>No similar films found.</p>
          )}
          {similar.length > 0 && (
            <div className="similar-grid">
              {similar.map((m) => (
                <div key={m.id} className="similar-card" onClick={() => handleSimilarClick(m)}>
                  {m.poster ? (
                    <img className="similar-poster" src={m.poster} alt={m.title} loading="lazy" />
                  ) : (
                    <div className="similar-poster-placeholder">🎬</div>
                  )}
                  <p className="similar-title">{m.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
