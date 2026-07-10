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
  Filler
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
  Filler
);

interface BigOChartProps {
  currentOpsCount?: number;
}

export const BigOChart: React.FC<BigOChartProps> = ({ currentOpsCount }) => {
  const labels = ['n=5', 'n=10', 'n=20', 'n=40', 'n=80'];

  const data = {
    labels,
    datasets: [
      {
        label: 'O(n) Linear',
        data: [5, 10, 20, 40, 80],
        borderColor: 'rgba(56, 189, 248, 0.4)',
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        borderWidth: 1.5,
        tension: 0.1,
      },
      {
        label: 'O(n log n)',
        data: [11.6, 33.2, 86.4, 212.8, 505.7],
        borderColor: 'rgba(168, 85, 247, 0.4)',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        borderWidth: 1.5,
        tension: 0.1,
      },
      {
        label: 'O(n²)',
        data: [25, 100, 400, 1600, 6400],
        borderColor: 'rgba(239, 68, 68, 0.4)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 1.5,
        tension: 0.1,
      },
      ...(currentOpsCount !== undefined ? [{
        label: 'Your Run Operations',
        data: [currentOpsCount * 0.1, currentOpsCount * 0.3, currentOpsCount * 0.6, currentOpsCount * 0.8, currentOpsCount],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 10, family: 'JetBrains Mono' }
        }
      },
      title: {
        display: true,
        text: 'Algorithm Complexity Benchmarking',
        color: '#f8fafc',
        font: { size: 12, family: 'Inter', weight: 'bold' as const }
      }
    },
    scales: {
      x: {
        grid: { color: '#1e293b' },
        ticks: { color: '#94a3b8', font: { size: 9, family: 'JetBrains Mono' } }
      },
      y: {
        grid: { color: '#1e293b' },
        ticks: { color: '#94a3b8', font: { size: 9, family: 'JetBrains Mono' } }
      }
    }
  };

  return (
    <div className="w-full h-full p-4 rounded-lg border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}>
      <Line options={options} data={data} />
    </div>
  );
};
