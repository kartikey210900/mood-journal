import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MOODS } from "../constants/moods";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MoodTrendGraph({ entries }) {
  const moodCounts = MOODS.map((mood) => ({
    name: mood.name,
    data: entries
      .slice(-7)
      .map((entry) => (entry.mood === mood.name ? 1 : 0)),
  }));

  const data = {
    labels: entries.slice(-7).map((entry) => entry.date),
    datasets: moodCounts.map((mood, index) => ({
      label: mood.name,
      data: mood.data,
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      fill: false,
    })),
  };

  const options = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Mood Occurrences" } },
      x: { title: { display: true, text: "Date" } },
    },
  };

  return (
    <div className="mood-graph">
      <h2>Weekly Mood Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default MoodTrendGraph;