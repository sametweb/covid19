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
          country =>
            country.Country &&
            country.TotalConfirmed > 0 &&
            !country.Country.includes("Islamic") &&
            !country.Country.includes("Korea, South") &&
            !country.Country.includes("Republic of Korea") &&
            !country.Country.includes("Viet Nam") &&
            !country.Country.includes("Taiwan*") &&
            !country.Country.includes("Bahamas, The") &&
            !country.Country.includes("Gambiya, The")
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
            label: "Aktif Teşhisler",
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
        <div>
          <CanvasJSChart
            options={options}
            /* onRef={ref => this.chart = ref} */
          />
        </div>
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
      <table style={{ position: "relative" }}>
        <thead>
          <tr style={{ height: 30 }}>
            <th rowSpan={2}>Ülke</th>
            <th colSpan={2}>Teşhisler</th>
            <th colSpan={2}>Ölümler</th>
            <th colSpan={2}>İyileşenler</th>
          </tr>
          {/* prettier-ignore */}
          <tr style={{ height: 30 }} >
            <RenderColumnHeader sort={sort} columnName={"NewConfirmed"} title="Yeni" sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalConfirmed"} title="Toplam" sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"NewDeaths"} title="Yeni" sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalDeaths"} title="Toplam" sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"NewRecovered"} title="Yeni" sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalRecovered"} title="Toplam" sortCountries={sortCountries} />
          </tr>
        </thead>
        <tbody>
          {countries
            .filter(({ Country }) =>
              Country.toLowerCase().includes(search.toLowerCase())
            )
            .map((country, i) => {
              return (
                <tr
                  key={i}
                  style={i % 2 ? { backgroundColor: "#f1f1f2" } : {}}
                  className="country"
                >
                  <td className="countryName">
                    <Link to={country.Slug}>{country.Country}</Link>
                  </td>
                  <td
                    style={
                      country.NewConfirmed ? { color: "rgb(168, 137, 45)" } : {}
                    }
                  >
                    {country.NewConfirmed
                      ? `+${country.NewConfirmed.toLocaleString()}`
                      : country.NewConfirmed.toLocaleString()}
                  </td>
                  <td>{country.TotalConfirmed.toLocaleString()}</td>
                  <td style={country.NewDeaths ? { color: "crimson" } : {}}>
                    {country.NewDeaths
                      ? `+${country.NewDeaths.toLocaleString()}`
                      : country.NewDeaths.toLocaleString()}
                  </td>
                  <td>{country.TotalDeaths.toLocaleString()}</td>
                  <td
                    style={
                      country.NewRecovered && country.NewRecovered > 0
                        ? { color: "green" }
                        : {}
                    }
                  >
                    {country.NewRecovered && country.NewRecovered > 0
                      ? `+${country.NewRecovered.toLocaleString()}`
                      : country.NewRecovered.toLocaleString()}
                  </td>
                  <td>{country.TotalRecovered.toLocaleString()}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const RenderColumnHeader = ({ sort, columnName, title, sortCountries }) => {
  return (
    <th
      className="sort"
      style={sort.by === columnName ? { background: "darkred" } : {}}
      onClick={() => sortCountries(columnName)}
    >
      {sort.by !== columnName ? (
        <i className="fa fa-sort"></i>
      ) : sort.order === "desc" ? (
        <i className="fa fa-sort-down"></i>
      ) : (
        <i className="fa fa-sort-up"></i>
      )}{" "}
      {title}
    </th>
  );
};

export default Summary;
