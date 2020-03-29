import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Summary = props => {
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then(res => {
        const data = res.data.Countries.filter(
          country => country.Country && country.TotalConfirmed > 0
        ).map(country =>
          country.Country === "US"
            ? { ...country, Country: "United States of America" }
            : country
        );
        setCountries(data);
        setStats({
          total: data.reduce((acc, item) => (acc += item.TotalConfirmed), 0),
          active:
            data.reduce((acc, item) => (acc += item.TotalConfirmed), 0) -
            data.reduce((acc, item) => (acc += item.TotalRecovered), 0) -
            data.reduce((acc, item) => (acc += item.TotalDeaths), 0),
          recovered: data.reduce(
            (acc, item) => (acc += item.TotalRecovered),
            0
          ),
          deaths: data.reduce((acc, item) => (acc += item.TotalDeaths), 0)
        });
      })
      .catch(err => console.log(err));
  }, []);

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: ""
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}",
        dataPoints: [
          {
            label: "Aktif Tanılar",
            y: stats.active
          },
          {
            label: "İyileşenler",
            y: stats.recovered
          },
          {
            label: "Ölümler",
            y: stats.deaths
          }
        ]
      }
    ]
  };
  console.log(stats);

  return (
    <div>
      <div style={{ marginBottom: 50 }}>
        <h1>COVID-19 Dünya Geneli Toplam İstatistikler</h1>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
      </div>
      <h1>Ülke Bazında İstatistikler</h1>
      <div className="search">
        <input
          placeholder="ülkelerde ara"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")}>Temizle</button>
      </div>
      <table>
        <tbody>
          <tr
            style={{
              backgroundColor: "#333",
              color: "white",
              height: 30
            }}
          >
            <th>Ülke</th>
            <th>Yeni Tanılar</th>
            <th>Toplam Tanılar</th>
            <th>Yeni Ölümler</th>
            <th>Toplam Ölümler</th>
            <th>Yeni İyileşenler</th>
            <th>Toplam İyileşenler</th>
          </tr>
          {countries
            .filter(({ Country }) =>
              Country.toLowerCase().includes(search.toLowerCase())
            )
            .map((country, i) => {
              return (
                <tr key={i} style={i % 2 ? { backgroundColor: "#f1f1f2" } : {}}>
                  <td>
                    <Link to={country.Slug}>{country.Country}</Link>
                  </td>
                  <td
                    style={
                      country.NewConfirmed ? { color: "rgb(168, 137, 45)" } : {}
                    }
                  >
                    {country.NewConfirmed
                      ? `+${country.NewConfirmed}`
                      : country.NewConfirmed}
                  </td>
                  <td>{country.TotalConfirmed}</td>
                  <td style={country.NewDeaths ? { color: "crimson" } : {}}>
                    {country.NewDeaths
                      ? `+${country.NewDeaths}`
                      : country.NewDeaths}
                  </td>
                  <td>{country.TotalDeaths}</td>
                  <td style={country.NewRecovered ? { color: "green" } : {}}>
                    {country.NewRecovered
                      ? `+${country.NewRecovered}`
                      : country.NewRecovered}
                  </td>
                  <td>{country.TotalRecovered}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
