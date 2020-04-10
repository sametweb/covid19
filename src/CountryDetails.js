import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import lang from "./lang";
import { Line } from "react-chartjs-2";
import { addComma } from "./Summary";
import Header from "./Header";

const CountryDetails = (props) => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (!localStorage.getItem("langCode"))
      localStorage.setItem("langCode", lang.defaultLanguage);
    return localStorage.getItem("langCode");
  });
  const [country, setCountry] = useState("");
  const [data, setData] = useState([]);
  const language = lang[languageCode].CountryDetails;

  const toggleLanguage = (code) => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  const { slug } = props.match.params;

  const getData = (country) => {
    const confirmedRequest = axios.get(
      `https://api.covid19api.com/total/country/${country}/status/confirmed`
    );
    const recoveredRequest = axios.get(
      `https://api.covid19api.com/total/country/${country}/status/recovered`
    );
    const deathsRequest = axios.get(
      `https://api.covid19api.com/total/country/${country}/status/deaths`
    );

    axios.all([confirmedRequest, recoveredRequest, deathsRequest]).then(
      axios.spread((...responses) => {
        setCountry(responses[1].data[0]?.Country);
        setData(
          responses[0].data.map((confirmed) => {
            const recovered = responses[1].data.length
              ? responses[1].data.find(
                  (recovered) => recovered.Date === confirmed.Date
                )
              : [];
            const deaths = responses[2].data.length
              ? responses[2].data.find((death) => death.Date === confirmed.Date)
              : [];

            return {
              date: confirmed.Date.substr(0, 10),
              confirmed: confirmed.Cases,
              recovered: recovered?.Cases || 0,
              deaths: deaths?.Cases || 0,
            };
          })
        );
      })
    );
  };

  useEffect(() => {
    getData(slug);
  }, [slug]);

  return (
    <div>
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        languageCode={languageCode}
        lang={lang}
      />

      <Helmet>
        <title>{language.title}</title>
        <meta name="description" content={language.description(country)} />
      </Helmet>
      <Line
        data={{
          labels: data.map((a) => a.date),
          datasets: [
            {
              label: language.totalDiagnoses,
              data: data.map((a) => a.confirmed),
              backgroundColor: ["rgba(48, 105, 167, 0.3)"],
              borderColor: ["rgba(48, 105, 167, 0.7)"],
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 4,
              pointBackgroundColor: "rgba(48, 105, 167, 0.5)",
            },
          ],
        }}
        options={{
          title: {
            display: true,
            text: language.dailySpread,
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "top",
          },
          tooltips: {
            callbacks: {
              title: (a, b) => b.datasets[a[0].datasetIndex].label,
              label: (a, b) =>
                `${b.labels[a.index]}: ${addComma(
                  b.datasets[0].data[a.index]
                )}`,
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value, index, values) => addComma(value),
                },
              },
            ],
          },
        }}
      />
      <Line
        data={{
          labels: data.map((a) => a.date),
          datasets: [
            {
              label: language.recovered,
              data: data.map((a) => a.recovered),
              backgroundColor: ["rgba(78, 167, 48, 0.3)"],
              borderColor: ["rgba(78, 167, 48, 0.7)"],
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 4,
              pointBackgroundColor: "rgba(78, 167, 48, 0.5)",
            },
            {
              label: language.deaths,
              data: data.map((a) => a.deaths),
              backgroundColor: ["rgba(167, 48, 48, 0.3)"],
              borderColor: ["rgba(167, 48, 48, 0.7)"],
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 4,
              pointBackgroundColor: "rgba(167, 48, 48, 0.5)",
            },
          ],
        }}
        options={{
          title: {
            display: true,
            text: language.dailyRecoveriesAndDeaths,
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "top",
          },
          tooltips: {
            callbacks: {
              title: (a, b) => b.datasets[a[0].datasetIndex].label,
              label: (a, b) =>
                `${b.labels[a.index]}: ${addComma(
                  b.datasets[0].data[a.index]
                )}`,
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value, index, values) => addComma(value),
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default CountryDetails;
