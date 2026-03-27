import { useState } from "react";
import MoodInput from "./components/MoodInput";
import SearchInput from "./components/SearchInput";
import MovieGrid from "./components/MovieGrid";
import RatedMovies from "./components/RatedMovies";
import MovieModal from "./components/MovieModal";
import "./App.css";

function App() {
  const [results, setResults] = useState(null);
  const [moodData, setMoodData] = useState(null);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("discover");
  const [inputMode, setInputMode] = useState("mood");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleRecommend = async (moodText) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setMoodData(null);
    try {
      const res = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood_text: moodText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.recommendations);
      setMoodData(data.mood_analysis);
    } catch (e) {
      setError(e.message || "Something went wrong. Is the Flask server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setMoodData(null);
    try {
      const res = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results);
    } catch (e) {
      setError(e.message || "Search failed. Is the Flask server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (movieId, rating) => {
    try {
      await fetch("http://localhost:5000/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: movieId, rating }),
      });
      setRatings((prev) => ({ ...prev, [movieId]: rating }));
    } catch (e) {
      console.error("Rating failed:", e);
    }
  };

  const switchMode = (mode) => {
    setInputMode(mode);
    setResults(null);
    setMoodData(null);
    setError(null);
  };

  const ratedMovies = results ? results.filter((m) => ratings[m.id]) : [];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">▶</span>
            <span className="logo-text">CineMood</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${activeTab === "discover" ? "active" : ""}`} onClick={() => setActiveTab("discover")}>Discover</button>
            <button className={`nav-btn ${activeTab === "rated" ? "active" : ""}`} onClick={() => setActiveTab("rated")}>
              My Ratings
              {ratedMovies.length > 0 && <span className="badge">{ratedMovies.length}</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === "discover" && (
          <>
            <div className="mode-toggle">
              <button className={`mode-btn ${inputMode === "mood" ? "active" : ""}`} onClick={() => switchMode("mood")}>
                ◎ &nbsp;Mood Match
              </button>
              <button className={`mode-btn ${inputMode === "search" ? "active" : ""}`} onClick={() => switchMode("search")}>
                ⊕ &nbsp;Search Films
              </button>
            </div>

            {inputMode === "mood"
              ? <MoodInput onSubmit={handleRecommend} loading={loading} />
              : <SearchInput onSubmit={handleSearch} loading={loading} />
            }

            {error && <div className="error-msg">{error}</div>}
            {loading && <div className="loading-bar"><div className="loading-bar-inner" /></div>}

            {moodData && (
              <div className="mood-banner">
                <span className="mood-emotion">{moodData.emotion}</span>
                <span className="mood-sep">·</span>
                <span className="mood-sentiment">{moodData.sentiment}</span>
                <span className="mood-sep">·</span>
                <span className="mood-polarity">polarity {moodData.polarity > 0 ? "+" : ""}{moodData.polarity}</span>
              </div>
            )}

            {results && (
              <MovieGrid movies={results} ratings={ratings} onRate={handleRate} onSelect={setSelectedMovie} />
            )}
          </>
        )}

        {activeTab === "rated" && (
          <RatedMovies movies={ratedMovies} ratings={ratings} onRate={handleRate} onSelect={setSelectedMovie} />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          userRating={ratings[selectedMovie.id]}
          onRate={handleRate}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={setSelectedMovie}
          ratings={ratings}
        />
      )}
    </div>
  );
}

export default App;
