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
  const [xRange, setXRange] = useState([0, 10]); // X axis range (start, end)
  const [yRange, setYRange] = useState([0, 100]); // Y axis range (min, max)

  useEffect(() => {
    if (data) {
      const timestamps = [];
      const fearData = [];
      const happinessData = [];
      const PHQScoreData = [];
      const BDIScoreData = [];
      const sadnessData = [];
      const angerData = [];
      const surpriseData = [];
      const disgustData = [];

      Object.keys(data).forEach((key) => {
        const entry = data[key];
        timestamps.push(entry.timestamp);
        fearData.push(entry.mental_health_data.fear);
        happinessData.push(entry.mental_health_data.happiness);
        PHQScoreData.push(entry.mental_health_data.PHQ_score);
        BDIScoreData.push(entry.mental_health_data.BDI_score);
        sadnessData.push(entry.mental_health_data.sadness);
        angerData.push(entry.mental_health_data.anger);
        surpriseData.push(entry.mental_health_data.surprise);
        disgustData.push(entry.mental_health_data.disgust);
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
            tension: 0.4,
          },
          {
            label: "Happiness",
            data: happinessData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "PHQ Score",
            data: PHQScoreData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "BDI Score",
            data: BDIScoreData,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Sadness",
            data: sadnessData,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Anger",
            data: angerData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Surprise",
            data: surpriseData,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Disgust",
            data: disgustData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
            tension: 0.4,
          },
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Mental Health',
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw.toFixed(2);
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: chartData.labels,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          min: xRange[0],
          max: xRange[1],
        },
      },
      y: {
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: 'Values',
        },
        ticks: {
          min: yRange[0],
          max: yRange[1],
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const handleXRangeChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setXRange(value);
  };

  const handleYRangeChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setYRange(value);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Line data={chartData} options={options} />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
       {/**  <div>
          <label>X Axis Range: </label>
          <input
            type="range"
            min="0"
            max={chartData.labels.length - 1}
            value={`${xRange[0]},${xRange[1]}`}   TODO: FIX THE SCROLLING
            onChange={handleXRangeChange}
            step="1"
            style={{ width: '80%' }}
          />
        </div>
        <div>
          <label>Y Axis Range: </label>
          <input
            type="range"
            min="0"
            max={Math.max(...chartData.datasets.flatMap(dataset => dataset.data))}
            value={`${yRange[0]},${yRange[1]}`}
            onChange={handleYRangeChange}
            step="1"
            style={{ width: '80%' }}
          />
        </div> */}
      </div> 

    </div>
  );
};

export default LineGraph;
