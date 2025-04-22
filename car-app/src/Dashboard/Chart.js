import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Chart = ({ data }) => {
  // Destructure the data with default values
  const { 
    completedAmount = 0, 
    inProcessAmount = 0, 
    canceledAmount = 0, 
    pendingAmount = 0 
  } = data;

    // Calculate total for percentage calculation
    const total = completedAmount + inProcessAmount + canceledAmount + pendingAmount;

  const chartData = {
    labels: [
      'Completed Orders',
      'In Process Orders',
      'Canceled Orders',
      'Pending Orders'
    ],
    datasets: [
      {
        label: 'Orders',
        data: [ completedAmount, inProcessAmount, canceledAmount, pendingAmount ],
        backgroundColor: [
          '#28a745', // green for completed orders
          '#ffc107', // orange for in process orders
          '#dc3545', // red for canceled orders
          '#007bff'  // blue for pending orders
        ],
        hoverBackgroundColor: [
          '#1e7e34',
          '#d39e00',
          '#bd2130',
          '#0056b3'
        ],
        cutout: '60%' // This makes it a donut chart
      }
    ]
  };


  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value) => {
          let percentage = 0;
          if (total > 0) {
            percentage = ((value / total) * 100).toFixed(1);
          }
          return `${percentage}%`;
        },
        font: {
          weight: 'bold',
          size: 14,
        }
      },
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
  };



  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', height:'300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default Chart;
