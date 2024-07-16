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

const CustomerChart = ({ selectedCustomer }) => {
  const chartData = {
    labels: selectedCustomer ? selectedCustomer.transactions.map((t) => t.date) : [],
    datasets: [
      {
        label: 'Transaction Amount',
        data: selectedCustomer ? selectedCustomer.transactions.map((t) => t.amount) : [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    selectedCustomer && (
      <div className="mt-4">
        <h2>Transaction for {selectedCustomer.name}</h2>
        <Line data={chartData} />
      </div>
    )
  );
};

export default CustomerChart;
