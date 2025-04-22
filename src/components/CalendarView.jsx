import { FaFileExport } from "react-icons/fa";
import { MOODS } from "../constants/moods";

function CalendarView({ entries, filterMood, setFilterMood }) {
  const filteredEntries = filterMood
    ? entries.filter((entry) => entry.mood === filterMood)
    : entries;

  const exportToCSV = () => {
    const headers = ["Date,Mood,Note,Weather,Temperature"];
    const rows = entries.map(
      (entry) =>
        `${entry.date},${entry.mood},${entry.note.replace(/,/g, ";")},${entry.weather},${entry.temp}`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mood_journal.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Mood History</h2>
        <div className="calendar-controls">
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="filter-select"
          >
            <option value="">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <button onClick={exportToCSV} className="export-button">
            <FaFileExport style={{ marginRight: "0.5rem" }} />
            Export to CSV
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <div key={index} className="calendar-day">
              <span className="emoji">
                {MOODS.find((m) => m.name === entry.mood)?.emoji}
              </span>
              <div className="content">
                <p className="date">{entry.date}</p>
                <p className="note">{entry.note}</p>
                <p className="weather">
                  Weather: {entry.weather}, {entry.temp}°C
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-entries">No entries found.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;