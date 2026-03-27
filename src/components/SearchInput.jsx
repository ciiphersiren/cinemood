import { useState } from "react";

const SEARCH_SUGGESTIONS = [
  "The Dark Knight", "Inception", "Parasite", "Interstellar", "Spirited Away",
];

function SearchInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text.trim());
  };

  return (
    <section className="search-section">
      <h1 className="search-headline">
        Find a <span>Film</span>
      </h1>
      <p className="search-sub">
        Search by title to rate films you've watched or explore a movie.
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="e.g. Inception, Parasite, The Godfather..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          disabled={loading}
        />
        <button className="search-btn" type="submit" disabled={loading || !text.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mood-chips" style={{ marginTop: "1.25rem" }}>
        {SEARCH_SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="chip"
            onClick={() => { setText(s); onSubmit(s); }}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
}

export default SearchInput;
