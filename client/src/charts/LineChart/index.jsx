import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineChart({ datao }) {
  const options = {
    responsive: true,
    fill: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: datao.title,
      },
    },
  };
  const data = {
    labels: datao.labels,
    datasets: datao.datasets,
  };

  return <Line options={options} data={data} />;
}
