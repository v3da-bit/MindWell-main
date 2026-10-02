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

export type ChatWeeklyAnalysis = {
  week?: string;
  date?: string;
  text?: number;
};

interface Props {
  data: ChatWeeklyAnalysis[];
}

export default function ChatChart({ data }: Props) {
  const labels = data.map((w, i) => w.week || w.date || `Week ${i + 1}`);
  const dataset = [{
    label: 'Chat Intensity',
    data: data.map((w) => typeof w.text === 'number' ? w.text : 0),
    fill: false,
    borderColor: '#10b981',
    tension: 0.2,
  }];

  return (
    <div className="bg-white/5 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Weekly Chat Intensity Chart</h3>
      <Line
        data={{ labels, datasets: dataset }}
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
