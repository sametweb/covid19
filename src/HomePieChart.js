import React from "react";
import { Doughnut } from "react-chartjs-2";

const HomePieChart = (props) => {
  const { stats, language, addComma } = props;
  const pieData = {
    labels: [language.active, language.recovered, language.deaths],
    datasets: [
      {
        backgroundColor: [
          "rgba(48, 105, 167, 0.3)",
          "rgba(78, 167, 48, 0.3)",
          "rgba(167, 48, 48, 0.3)",
        ],
        hoverBackgroundColor: [
          "rgba(48, 105, 167, 0.5)",
          "rgba(78, 167, 48, 0.5)",
          "rgba(167, 48, 48, 0.5)",
        ],
        data: [
          (stats.TotalActiveCases / stats.TotalConfirmed) * 100,
          (stats.TotalRecovered / stats.TotalConfirmed) * 100,
          (stats.TotalDeaths / stats.TotalConfirmed) * 100,
        ],
      },
    ],
  };

  return (
    <Doughnut
      data={pieData}
      options={{
        title: {
          display: true,
          text: language.totalCaseDistribution,
          fontSize: 20,
        },
        legend: {
          display: false,
          position: "right",
        },
        tooltips: {
          callbacks: {
            label: (a, b) =>
              `${b.labels[a.index]}: %${addComma(b.datasets[0].data[a.index])}`,
          },
        },
      }}
    />
  );
};

export default HomePieChart;
