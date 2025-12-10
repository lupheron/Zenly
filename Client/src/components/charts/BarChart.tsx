"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { useLanguage } from "@/src/contexts/LanguageContext";

interface BarChartProps {
  labels: string[];
  data: number[];
}

const COLORS = [
  "#36A2EB",
  "#FF6384",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
  "#B2FF66",
  "#FF66B2",
  "#66FFB2"
];

const BarChart: React.FC<BarChartProps> = ({ labels, data }) => {
  const { t } = useLanguage();
  // Check if there's data to display
  if (!data || data.length === 0 || data.every(value => value === 0)) {
    return (
      <div className="w-full min-h-[200px] h-[250px] md:h-[300px] xl:h-[400px] max-w-3xl mx-auto flex items-center justify-center">
        <p className="text-gray-500 text-lg">{t('user.noData')}</p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Necha marta band qilindi",
        data,
        backgroundColor: COLORS,
        borderWidth: 1,
        barThickness: 30,
        maxBarThickness: 20,
        categoryPercentage: 0.6,
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 13,
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div className="w-full min-h-[200px] h-[250px] md:h-[300px] xl:h-[400px] max-w-3xl mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
