import StarRating from "./StarRating";

const STAR_LABELS = ["", "Didn't like it", "It was ok", "Liked it", "Really liked it", "Loved it"];

function RatedMovies({ movies, ratings, onRate }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <h2>No ratings yet</h2>
        <p>Rate films on the Discover tab and they'll appear here.</p>
      </div>
    );
  }

  const sorted = [...movies].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0));

  return (
    <div>
      <p className="grid-label">
        <strong>{movies.length} film{movies.length > 1 ? "s" : ""}</strong> rated
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sorted.map((movie) => {
          const rating = ratings[movie.id] || 0;
          return (
            <div
              key={movie.id}
              style={{
                display: "flex",
                gap: "16px",
                background: "var(--bg2)",
                border: "0.5px solid var(--border)",
                borderRadius: "8px",
                padding: "12px",
                alignItems: "center",
              }}
            >
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: "52px", height: "78px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: "52px", height: "78px", background: "var(--bg3)", borderRadius: "4px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎬</div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: "14px", marginBottom: "4px" }}>{movie.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "8px" }}>
                  {movie.release_year && <span>{movie.release_year} · </span>}
                  <span style={{ color: "#f5c518" }}>★ {movie.tmdb_rating?.toFixed(1)}</span>
                </p>
                <StarRating movieId={movie.id} value={rating} onRate={onRate} />
                {rating > 0 && (
                  <p style={{ fontSize: "11px", color: "var(--text2)", marginTop: "4px" }}>
                    {STAR_LABELS[rating]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatedMovies;
