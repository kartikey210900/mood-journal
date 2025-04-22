import { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaSun } from "react-icons/fa";
import MoodEntryForm from "./components/MoodEntryForm";
import CalendarView from "./components/CalendarView";
import MoodTrendGraph from "./components/MoodTrendGraph";
import { MOODS } from "./constants/moods";

function App() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [weather, setWeather] = useState(null);
  const [entries, setEntries] = useState([]);
  const [filterMood, setFilterMood] = useState("");
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    setEntries(savedEntries);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
                import.meta.env.VITE_OPENWEATHER_API_KEY
              }&units=metric`
            );
            setWeather(response.data);
          } catch (error) {
            console.error("Error fetching weather:", error);
            setMessage("Failed to fetch weather data.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMessage("Please allow location access to fetch weather data.");
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  }, [isDarkMode]);

  const saveEntry = () => {
    if (!mood) {
      setMessage("Please select a mood.");
      return;
    }
    if (!note.trim()) {
      setMessage("Please enter a note.");
      return;
    }

    const newEntry = {
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      mood,
      note,
      weather: weather ? weather.weather[0].main : "Unknown",
      temp: weather ? weather.main.temp : null,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
    setMood("");
    setNote("");
    setMessage("Entry saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Dark mode:", !isDarkMode, document.documentElement.classList);
  };

  const getBackgroundColor = () => {
    const defaultBg = isDarkMode
      ? { backgroundColor: "#0f172a" }
      : { backgroundColor: "#f8fafc" };
  
    // Log mood for debugging
    console.log('Current mood:', mood);
  
    const selectedMood = MOODS.find((m) => m.name === mood);
    if (!selectedMood) {
      console.log('No matching mood found in MOODS');
      return defaultBg;
    }
  
    // Log selectedMood for debugging
    console.log('Selected mood:', selectedMood);
  
    if (!selectedMood.color || typeof selectedMood.color !== 'string') {
      console.warn(`Invalid color property for mood ${selectedMood.name}:`, selectedMood.color);
      return defaultBg;
    }
  
    const colorParts = selectedMood.color.split(";");
    if (colorParts.length !== 2) {
      console.warn(`Invalid color format for mood ${selectedMood.name}: ${selectedMood.color}`);
      return defaultBg;
    }
  
    const [lightPart, darkPart] = colorParts;
    const lightBg = lightPart.split(":")[1]?.trim();
    const darkBg = darkPart.split(":")[1]?.trim();
  
    if (!lightBg || !darkBg) {
      console.warn(`Invalid color values for mood ${selectedMood.name}: ${selectedMood.color}`);
      return defaultBg;
    }
  
    return isDarkMode
      ? { backgroundColor: darkBg }
      : { backgroundColor: lightBg };
  };

  return (
    <div className="container" style={getBackgroundColor()}>
      <div className="header">
        <h1>Mood Journal</h1>
        <button
          onClick={toggleDarkMode}
          className="toggle-button"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <MoodEntryForm
        mood={mood}
        setMood={setMood}
        note={note}
        setNote={setNote}
        weather={weather}
        saveEntry={saveEntry}
        message={message}
      />
      <CalendarView
        entries={entries}
        filterMood={filterMood}
        setFilterMood={setFilterMood}
      />
      <MoodTrendGraph entries={entries} />
    </div>
  );
}

export default App;