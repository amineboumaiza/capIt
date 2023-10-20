import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = ({
  encoursPercentage,
  refuséPercentage,
  qualifiéPercentage,
  confirmationPercentage,
}) => {
  const chartData = {
    series: [
      encoursPercentage,
      refuséPercentage,
      qualifiéPercentage,
      confirmationPercentage,
    ],
    options: {
      labels: ["Encours", "Refusé", "Qualifié", "Confirmé"],
      colors: ["#0481D3", "#F7701F", "#A335B0", "#6BB331"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return val.toFixed(2) + "%"; // Rounds the percentage to 2 decimal places
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="donut"
      height={350}
    />
  );
};

export default PieChart;
