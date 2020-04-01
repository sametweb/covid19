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
  const [sort, setSort] = useState({ by: "", order: "" });

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
            y: stats.active,
            color: "royalblue"
          },
          {
            label: "İyileşenler",
            y: stats.recovered,
            color: "limegreen"
          },
          {
            label: "Ölümler",
            y: stats.deaths,
            color: "orangered"
          }
        ]
      }
    ]
  };
  console.log(countries);

  const sortCountries = columnName => {
    setSort({ by: columnName, order: sort.order === "desc" ? "asc" : "desc" });
  };

  useEffect(() => {
    setCountries([
      ...countries.sort((a, b) =>
        sort.order === "desc"
          ? b[sort.by] - a[sort.by]
          : a[sort.by] - b[sort.by]
      )
    ]);
  }, [sort.by, sort.order]);

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
            <th className="sort" onClick={() => sortCountries("NewConfirmed")}>
              {sort.by !== "NewConfirmed" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Yeni Tanılar
            </th>
            <th
              className="sort"
              onClick={() => sortCountries("TotalConfirmed")}
            >
              {sort.by !== "TotalConfirmed" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Toplam Tanılar
            </th>
            <th className="sort" onClick={() => sortCountries("NewDeaths")}>
              {sort.by !== "NewDeaths" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Yeni Ölümler
            </th>
            <th className="sort" onClick={() => sortCountries("TotalDeaths")}>
              {sort.by !== "TotalDeaths" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Toplam Ölümler
            </th>
            <th className="sort" onClick={() => sortCountries("NewRecovered")}>
              {sort.by !== "NewRecovered" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Yeni İyileşenler
            </th>
            <th
              className="sort"
              onClick={() => sortCountries("TotalRecovered")}
            >
              {sort.by !== "TotalRecovered" ? (
                <i class="fa fa-sort"></i>
              ) : sort.order === "desc" ? (
                <i class="fa fa-sort-down"></i>
              ) : (
                <i class="fa fa-sort-up"></i>
              )}{" "}
              Toplam İyileşenler
            </th>
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
                  <td
                    style={
                      country.NewRecovered && country.NewRecovered > 0
                        ? { color: "green" }
                        : {}
                    }
                  >
                    {country.NewRecovered && country.NewRecovered > 0
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
