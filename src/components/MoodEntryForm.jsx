import { MOODS, WEATHER_ICONS } from "../constants/moods";

function MoodEntryForm({ mood, setMood, note, setNote, weather, saveEntry, message }) {
  return (
    <div className="mood-form">
      <h2>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h2>
      {weather && (
        <div className="weather-info">
          <span className="weather-icon">
            {WEATHER_ICONS[weather.weather[0].main] || "🌍"}
          </span>
          <p className="weather-text">
            {weather.weather[0].description}, {weather.main.temp}°C
          </p>
        </div>
      )}
      <div className="mood-buttons">
        <h3>Select Your Mood:</h3>
        <div className="mood-button-group">
          {MOODS.map((m) => (
            <button
              key={m.name}
              onClick={() => setMood(m.name)}
              className={`mood-button ${mood === m.name ? "selected" : ""}`}
              title={m.name}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="note-section">
        <label className="note-label">Daily Note:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="note-textarea"
          rows="4"
          placeholder="How are you feeling today?"
          maxLength={500}
        />
      </div>
      <button onClick={saveEntry} className="save-button">
        Save Entry
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default MoodEntryForm;