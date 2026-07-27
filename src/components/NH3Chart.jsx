import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function NH3Chart({ labels, data }) {
  const lastVal = data.length > 0 ? data[data.length - 1] : 0;
  let lineColor = '#4ade80'; let bgColor = 'rgba(74, 222, 128, 0.2)';
  if (lastVal > 25) { lineColor = '#ef4444'; bgColor = 'rgba(239, 68, 68, 0.2)'; } 
  else if (lastVal >= 20) { lineColor = '#facc15'; bgColor = 'rgba(250, 204, 21, 0.2)'; }

  // Se não houver dados, array vazio para não bugar o chart
  const hasData = data.length > 0;

  const chartData = { 
    labels: hasData ? labels : ['--','--','--','--','--'], 
    datasets: [{ 
      fill: true, 
      label: 'Concentração NH₃ (ppm)', 
      data: hasData ? data : [0,0,0,0,0], 
      borderColor: hasData ? lineColor : '#555', 
      backgroundColor: hasData ? bgColor : 'transparent', 
      borderWidth: 2, 
      tension: 0.4, 
      pointRadius: hasData ? 3 : 0 
    }] 
  };
  
  const options = { 
    responsive: true, 
    scales: { 
      y: { beginAtZero: true, suggestedMax: 35, grid: { color: '#333' }, ticks: { color: '#aaa' } }, 
      x: { grid: { color: '#333' }, ticks: { color: '#aaa' } } 
    }, 
    plugins: { legend: { display: false } },
    animation: false
  };
  
  return <Line data={chartData} options={options} />;
}