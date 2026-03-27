import StarRating from "./StarRating";

function MovieCard({ movie, userRating, onRate, onSelect }) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      {movie.poster ? (
        <img className="movie-poster" src={movie.poster} alt={movie.title} loading="lazy" />
      ) : (
        <div className="poster-placeholder">🎬</div>
      )}
      <div className="movie-info">
        <p className="movie-title">{movie.title}</p>
        <div className="movie-meta">
          {movie.release_year && <span>{movie.release_year}</span>}
          {movie.tmdb_rating > 0 && (
            <span className="tmdb-score">★ {movie.tmdb_rating.toFixed(1)}</span>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <StarRating movieId={movie.id} value={userRating || 0} onRate={onRate} />
        </div>
      </div>
    </div>
  );
}

function MovieGrid({ movies, ratings, onRate, onSelect }) {
  if (!movies || movies.length === 0) return null;
  return (
    <div>
      <p className="grid-label">
        <strong>{movies.length} films</strong> matched your mood
      </p>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            userRating={ratings[movie.id]}
            onRate={onRate}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
