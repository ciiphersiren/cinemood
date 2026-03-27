from textblob import TextBlob
import re

# Mood keyword → emotion mapping
MOOD_EMOTIONS = {
    "happy": ["happy", "joy", "excited", "great", "amazing", "wonderful", "fantastic", "cheerful", "elated", "thrilled"],
    "sad": ["sad", "unhappy", "depressed", "lonely", "heartbroken", "miserable", "gloomy", "down", "upset", "crying"],
    "angry": ["angry", "furious", "frustrated", "mad", "irritated", "annoyed", "rage", "livid", "bitter"],
    "fearful": ["scared", "anxious", "nervous", "worried", "afraid", "terrified", "stressed", "panicked", "dread"],
    "romantic": ["love", "romantic", "hopeful", "warm", "tender", "affectionate", "longing", "adore", "cherish"],
    "adventurous": ["adventurous", "bored", "restless", "curious", "energetic", "pumped", "hyped", "thrill", "wild"],
    "thoughtful": ["thoughtful", "reflective", "philosophical", "calm", "quiet", "introspective", "contemplative"],
    "nostalgic": ["nostalgic", "miss", "memories", "childhood", "old times", "past", "remember", "reminisce"],
}

# Emotion → Genre mapping
EMOTION_GENRE_MAP = {
    "happy":       [35, 10751, 16],       # Comedy, Family, Animation
    "sad":         [18, 10749, 36],        # Drama, Romance, History
    "angry":       [28, 53, 80],           # Action, Thriller, Crime
    "fearful":     [27, 9648, 53],         # Horror, Mystery, Thriller
    "romantic":    [10749, 18, 35],        # Romance, Drama, Comedy
    "adventurous": [12, 878, 28],          # Adventure, Sci-Fi, Action
    "thoughtful":  [18, 99, 36],           # Drama, Documentary, History
    "nostalgic":   [10751, 36, 35],        # Family, History, Comedy
    "neutral":     [28, 35, 18],           # Action, Comedy, Drama (default)
}

def analyze_mood(text: str) -> dict:
    """
    Analyzes mood text and returns sentiment + detected emotion + recommended genres.
    """
    text_lower = text.lower()
    blob = TextBlob(text)

    # Polarity: -1 (negative) to +1 (positive)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    if polarity > 0.2:
        sentiment_label = "positive"
    elif polarity < -0.2:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"

    # Detect emotion from keywords
    detected_emotion = "neutral"
    max_matches = 0
    for emotion, keywords in MOOD_EMOTIONS.items():
        matches = sum(1 for kw in keywords if kw in text_lower)
        if matches > max_matches:
            max_matches = matches
            detected_emotion = emotion

    # If sentiment is strongly positive but no keyword matched, default happy
    if detected_emotion == "neutral" and polarity > 0.4:
        detected_emotion = "happy"
    elif detected_emotion == "neutral" and polarity < -0.4:
        detected_emotion = "sad"

    genre_ids = EMOTION_GENRE_MAP.get(detected_emotion, EMOTION_GENRE_MAP["neutral"])

    return {
        "raw_text": text,
        "polarity": round(polarity, 3),
        "subjectivity": round(subjectivity, 3),
        "sentiment": sentiment_label,
        "emotion": detected_emotion,
        "genre_ids": genre_ids,
    }
