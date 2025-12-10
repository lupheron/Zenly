"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
import { useLanguage } from "@/src/contexts/LanguageContext";

interface LineChartProps {
  labels: string[];
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ labels, data }) => {
  const { t } = useLanguage();
  // Check if there's data to display
  if (!data || data.length === 0 || data.every(value => value === 0)) {
    return (
      <div className="w-full min-h-[200px] h-[250px] md:h-[300px] xl:h-[350px] max-w-2xl mx-auto flex items-center justify-center">
        <p className="text-gray-500 text-lg">{t('user.noData')}</p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Views",
        data,
        fill: false,
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full min-h-[200px] h-[250px] md:h-[300px] xl:h-[350px] max-w-2xl mx-auto">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
