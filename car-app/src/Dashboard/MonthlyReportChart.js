// MonthlyReportChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyReportChart = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/monthly-report");
        // Assuming the response format is { report: [ { year, month, totalOrders, totalAmount, completedOrders, inProcessOrders, canceledOrders, pendingOrders }, ... ] }
        setReport(response.data.report);
      } catch (error) {
        console.error("Error fetching monthly report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReport();
  }, []);

  if (loading) return <p>Loading report...</p>;
  if (!report.length) return <p>No report data available.</p>;

  // Sort report by year and month
  const sortedReport = report.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    }
    return a.year - b.year;
  });

  // Create labels as "MM/YYYY"
  const labels = sortedReport.map(item => `${item.month}/${item.year}`);

  // For example, you can choose to show total orders or total amount as a dataset.
  // Here, we'll show multiple datasets: totalAmount, completedOrders, inProcessOrders, canceledOrders, and pendingOrders.
  const totalAmounts = sortedReport.map(item => item.totalAmount);
  const completedOrders = sortedReport.map(item => item.completedOrders);
  const inProcessOrders = sortedReport.map(item => item.inProcessOrders);
  const canceledOrders = sortedReport.map(item => item.canceledOrders);
  const pendingOrders = sortedReport.map(item => item.pendingOrders);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Amount (₹)',
        data: totalAmounts,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Completed Orders',
        data: completedOrders,
        backgroundColor: 'rgba(40,167,69,0.6)', // green
      },
      {
        label: 'In Process Orders',
        data: inProcessOrders,
        backgroundColor: 'rgba(255,193,7,0.6)', // orange
      },
      {
        label: 'Canceled Orders',
        data: canceledOrders,
        backgroundColor: 'rgba(220,53,69,0.6)', // red
      },
      {
        label: 'Pending Orders',
        data: pendingOrders,
        backgroundColor: 'rgba(0,123,255,0.6)', // blue
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Monthly Report',
      },
    },
  };

  return (
    <div style={{ Width: '800px', margin: '0 auto', padding: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyReportChart;
