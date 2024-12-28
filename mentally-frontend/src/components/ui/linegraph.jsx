import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register Chart.js components and zoom plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const LineGraph = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [], // Timestamps
    datasets: [], // Data series for each mental health metric
  });

  useEffect(() => {
    if (data) {
      const timestamps = [];
      const fearData = [];
      const happinessData = [];
      const PHQScoreData = [];
      const BDIScoreData = [];
      const sadnessData = [];

      Object.keys(data).forEach((key) => {
        const entry = data[key];
        timestamps.push(entry.timestamp);
        fearData.push(entry.mental_health_data.fear);
        happinessData.push(entry.mental_health_data.happiness);
        PHQScoreData.push(entry.mental_health_data.PHQ_score);
        BDIScoreData.push(entry.mental_health_data.BDI_score);
        sadnessData.push(entry.mental_health_data.sadness);
      });

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Fear",
            data: fearData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
          },
          {
            label: "Happiness",
            data: happinessData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
          },
          {
            label: "PHQ Score",
            data: PHQScoreData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
          {
            label: "BDI Score",
            data: BDIScoreData,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            fill: false,
          },
          {
            label: "Sadness",
            data: sadnessData,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            fill: false,
          },
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures chart scales with parent container size
    plugins: {
      title: {
        display: true,
        text: 'Mental Health Data Over Time',
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Timestamp',
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5, // Show only 4-5 ticks at a time
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
    // Add zoom and pan options
    interaction: {
      mode: 'index',
      intersect: false,
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy', // Pan along both axes
      },
      zoom: {
        enabled: true,
        mode: 'xy', // Zoom along both axes
        sensitivity: 3, // Sensitivity of zoom
      },
    },
  };

  return <div style={{ position: 'relative', width: '100%', height: '400px' }}>
    <Line data={chartData} options={options} />
  </div>;
};

export default LineGraph;
