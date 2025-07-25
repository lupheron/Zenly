"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    labels: string[];
    data: number[];
}

const COLORS = [
    "#36A2EB",
    "#FF6384",
    "#FFCE56",
    "#4BC0C0"
];

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: COLORS,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                align: 'center' as const,
                fullSize: false, 
                labels: {
                    boxWidth: 20,
                    padding: 20,
                },
                maxWidth: 400, 
            },
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <div className="w-full min-h-[250px] h-[300px] md:h-[350px] xl:h-[400px] max-w-3xl mx-auto">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
