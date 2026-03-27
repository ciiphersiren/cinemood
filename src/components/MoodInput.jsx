import { useState } from "react";

const QUICK_MOODS = [
  "I feel happy and want to laugh",
  "I'm feeling sad and lonely",
  "I want something thrilling",
  "I'm in a romantic mood",
  "I feel adventurous and restless",
  "I want to think deeply",
];

function MoodInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text.trim());
  };

  const handleChip = (mood) => {
    setText(mood);
    onSubmit(mood);
  };

  return (
    <section className="mood-section">
      <h1 className="mood-headline">
        How are you <span>feeling</span>?
      </h1>
      <p className="mood-sub">
        Describe your mood and we'll find the perfect film for this moment.
      </p>

      <form className="mood-form" onSubmit={handleSubmit}>
        <input
          className="mood-input"
          type="text"
          placeholder="e.g. I feel nostalgic and a little melancholic..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          disabled={loading}
        />
        <button className="mood-btn" type="submit" disabled={loading || !text.trim()}>
          {loading ? "Analyzing..." : "Find Films"}
        </button>
      </form>

      <div className="mood-chips">
        {QUICK_MOODS.map((mood) => (
          <button
            key={mood}
            className="chip"
            onClick={() => handleChip(mood)}
            disabled={loading}
          >
            {mood}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MoodInput;
