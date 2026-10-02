import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type WeeklyAnalysis = {
  week?: string;
  date?: string;
  [key: string]: number | string | undefined;
};

interface Props {
  data: WeeklyAnalysis[];
}

export default function FaceExpressionChart({ data }: Props) {
  // Prepare chart data
  const labels = data.map((w, i) => w.week || w.date || `Week ${i + 1}`);
  const expressions = ['happy', 'sad', 'angry', 'neutral', 'fearful', 'disgusted', 'surprised'];

  const datasets = expressions.map((expr) => ({
    label: expr,
    data: data.map((w) => typeof w[expr] === 'number' ? w[expr] : 0),
    fill: false,
    borderColor: getColor(expr),
    tension: 0.2,
  }));

  function getColor(expr: string) {
    switch (expr) {
      case 'happy': return '#10b981';
      case 'sad': return '#0ea5e9';
      case 'angry': return '#f43f5e';
      case 'neutral': return '#64748b';
      case 'fearful': return '#f59e42';
      case 'disgusted': return '#84cc16';
      case 'surprised': return '#a21caf';
      default: return '#888';
    }
  }

  return (
    <div className="bg-white/5 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Weekly Face Expression Chart</h3>
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
          },
        }}
      />
    </div>
  );
}
