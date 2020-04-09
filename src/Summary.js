import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import lang from "./lang";
import { Pie, Doughnut } from "react-chartjs-2";

const Summary = (props) => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (!localStorage.getItem("langCode"))
      localStorage.setItem("langCode", lang.defaultLanguage);
    return localStorage.getItem("langCode");
  });

  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ by: "TotalConfirmed", order: "desc" });

  const language = lang[languageCode].Summary;

  const toggleLanguage = (code) => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then((res) => {
        sortCountryList(res.data.Countries, "desc", "TotalConfirmed");
        setStats(res.data.Global);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSort = (columnName) => {
    setSort({ by: columnName, order: sort.order === "desc" ? "asc" : "desc" });
  };

  const sortCountryList = (countries, order, by) =>
    setCountries([
      ...countries.sort((a, b) =>
        order === "desc" ? b[by] - a[by] : a[by] - b[by]
      ),
    ]);

  const addComma = (num) => Number(num).toLocaleString();

  useEffect(() => {
    sortCountryList(countries, sort.order, sort.by);
  }, [sort.by, sort.order]);

  const pieData = {
    labels: ["Active", "Recovered", "Deaths"],
    datasets: [
      {
        label: "Case Distribution",
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
          stats.TotalConfirmed - stats.TotalRecovered - stats.TotalDeaths,
          stats.TotalRecovered,
          stats.TotalDeaths,
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{language.title}</title>
        <meta name="description" content={language.description} />
      </Helmet>
      <header>
        <h1 className="title">{language.title}</h1>
        <div className="lang">
          <label>
            {language.language}:
            <select
              value={languageCode}
              onChange={(e) => toggleLanguage(e.target.value)}
            >
              {lang.languageList.map((L) => (
                <option key={L.code} value={L.code}>
                  {L.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <section className="summary">
        <div className="summary-header">
          Total Cases:{" "}
          {!stats.TotalConfirmed ? "..." : addComma(stats.TotalConfirmed)}
        </div>
        <div className="summary-body">
          <div className="summary-item active">
            <p>Total Active Cases</p>
            <p>
              {!stats.TotalConfirmed
                ? "..."
                : addComma(
                    stats.TotalConfirmed -
                      stats.TotalDeaths -
                      stats.TotalRecovered
                  )}
            </p>
          </div>
          <div className="summary-item recovered">
            <p>Total Recovered Cases</p>
            <p>
              {!stats.TotalRecovered ? "..." : addComma(stats.TotalRecovered)}
            </p>
          </div>
          <div className="summary-item deaths">
            <p>Total Deaths</p>
            <p>{!stats.TotalDeaths ? "..." : addComma(stats.TotalDeaths)}</p>
          </div>
        </div>
        <div className="summary-chart">
          <Doughnut
            data={pieData}
            options={{
              title: {
                display: true,
                text: "Total Case Distribution",
                fontSize: 20,
              },
              legend: {
                display: false,
                position: "right",
              },
              tooltips: {
                callbacks: {
                  label: (a, b) =>
                    `${b.labels[a.index]}: ${addComma(
                      b.datasets[0].data[a.index]
                    )}`,
                },
              },
            }}
          />
        </div>
      </section>
      <div className="country-list">
        <div className="country-list-header">
          <h3 className="country-list-title">{language.statsByCountry}</h3>
          <div className="search">
            <input
              placeholder={language.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => setSearch("")}>{language.clear}</button>
          </div>
        </div>
        <table className="country-list-table">
          <thead>
            <tr>
              <th rowSpan={2}>{language.country}</th>
              <th colSpan={2} className="WideHeader">
                {language.diagnoses}
              </th>
              <th colSpan={2} className="WideHeader">
                {language.deaths}
              </th>
              <th colSpan={2} className="WideHeader">
                {language.recovered}
              </th>
              <th colSpan={1} className="NarrowHeader">
                {language.diagnoses}
              </th>
              <th colSpan={1} className="NarrowHeader">
                {language.deaths}
              </th>
              <th colSpan={1} className="NarrowHeader">
                {language.recovered}
              </th>
            </tr>
            {/* prettier-ignore */}
            <tr >
            <RenderColumnHeader sort={sort} columnName={"NewConfirmed"} title={language.new} handleSort={handleSort}/>
            <RenderColumnHeader sort={sort} columnName={"TotalConfirmed"} title={language.total} handleSort={handleSort}/>
            <RenderColumnHeader sort={sort} columnName={"NewDeaths"} title={language.new} handleSort={handleSort}/>
            <RenderColumnHeader sort={sort} columnName={"TotalDeaths"} title={language.total} handleSort={handleSort}/>
            <RenderColumnHeader sort={sort} columnName={"NewRecovered"} title={language.new} handleSort={handleSort}/>
            <RenderColumnHeader sort={sort} columnName={"TotalRecovered"} title={language.total} handleSort={handleSort} />
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
                    className={`country-table-row${i % 2 ? "-dark" : ""}`}
                  >
                    <td className="country-name">
                      <Link to={country.Slug}>{country.Country}</Link>
                    </td>
                    <td
                      className={`${
                        country.NewConfirmed ? "new-confirmed" : ""
                      } NewConfirmed`}
                    >
                      {country.NewConfirmed ? `+` : ""}
                      {country.NewConfirmed.toLocaleString()}
                    </td>
                    <td>{country.TotalConfirmed.toLocaleString()}</td>
                    <td
                      className={`${
                        country.NewDeaths ? "new-deaths" : ""
                      } NewDeaths`}
                    >
                      {country.NewDeaths ? `+` : ""}
                      {country.NewDeaths.toLocaleString()}
                    </td>
                    <td>{country.TotalDeaths.toLocaleString()}</td>
                    <td
                      className={`${
                        country.NewRecovered > 0 ? "new-recovered" : ""
                      } NewRecovered`}
                    >
                      {country.NewRecovered > 0 ? `+` : ""}
                      {country.NewRecovered.toLocaleString()}
                    </td>
                    <td>{country.TotalRecovered.toLocaleString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <footer>
        designed and coded by{" "}
        <a href="https://github.com/sametweb" alt="samet mutevelli">
          samet mutevelli
        </a>{" "}
        | data:{" "}
        <a href="https://covid19api.com" alt="covid19 api">
          covid19api.com
        </a>
      </footer>
    </>
  );
};

const RenderColumnHeader = ({ sort, columnName, title, handleSort }) => {
  return (
    <th
      className={`sort ${columnName}`}
      style={sort.by === columnName ? { background: "darkred" } : {}}
      onClick={() => handleSort(columnName)}
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
