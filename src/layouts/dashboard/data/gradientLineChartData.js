import { useState, useEffect } from "react";
import axios from "axios";

const GradientLineChartData = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Level",
        color: "info",
        data: [],
      },
    ],
  });

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:8000/chart-data");
      const data = response.data;

      const labels = data.map((entry) => entry.month);
      const levels = data.map((entry) => entry.level);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Water Level",
            color: "info",
            data: levels,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Fetch data every 5 seconds
    }, 2000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return chartData;
};

export default GradientLineChartData;
