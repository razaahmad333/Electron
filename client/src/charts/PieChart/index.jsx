import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  const [datao, setData] = React.useState({
    labels: data.labels,
    datasets: data.datasets,
  });
  const options = {
    radius: 60,
    plugins: {
      title: {
        display: true,
        text: data.title,
      },
    },
  };

  return <Pie data={datao} options={options} />;
}
