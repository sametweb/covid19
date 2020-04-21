import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { Helmet } from "react-helmet";
import lang from "./lang";

const Summary = (props) => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (!localStorage.getItem("langCode"))
      localStorage.setItem("langCode", lang.defaultLanguage);
    return localStorage.getItem("langCode");
  });

  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ by: "", order: "" });

  const language = lang[languageCode].Summary;

  const toggleLanguage = (code) => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  const data01 = [
    { name: language.activeDiagnoses, value: stats.active },
    { name: language.deaths, value: stats.deaths },
    { name: language.recovered, value: stats.recovered },
  ];

  const colors = ["#293a80", "#f39422", "#537ec5"];

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then((res) => {
        const data = res.data.Countries.filter(
          (country) => country.Country && country.TotalConfirmed
          // !country.Country.includes("Islamic") &&
          // !country.Country.includes("Korea, South") &&
          // !country.Country.includes("Republic of Korea") &&
          // !country.Country.includes("Viet Nam") &&
          // !country.Country.includes("Taiwan*") &&
          // !country.Country.includes("Bahamas, The") &&
          // !country.Country.includes("Gambia, The")
        );
        // .map((country) =>
        //   country.Country === "US"
        //     ? { ...country, Country: "United States of America" }
        //     : country
        // );
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
          deaths: data.reduce((acc, item) => (acc += item.TotalDeaths), 0),
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const sortCountries = (columnName) => {
    setSort({ by: columnName, order: sort.order === "desc" ? "asc" : "desc" });
  };

  useEffect(() => {
    setCountries([
      ...countries.sort((a, b) =>
        sort.order === "desc"
          ? b[sort.by] - a[sort.by]
          : a[sort.by] - b[sort.by]
      ),
    ]);
  }, [sort.by, sort.order]);
  console.log(countries?.filter(({ Country }) => Country.includes("United")));

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
        <h2 className="subtitle">{language.subtitle(stats.total)}</h2>
      </header>
      <div className="summary-chart">
        <PieChart width={380} height={250}>
          <Pie
            dataKey="value"
            isAnimationActive
            data={data01}
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
          >
            {data01.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
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
            <RenderColumnHeader sort={sort} columnName={"NewConfirmed"} title={language.new} sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalConfirmed"} title={language.total} sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"NewDeaths"} title={language.new} sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalDeaths"} title={language.total} sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"NewRecovered"} title={language.new} sortCountries={sortCountries}/>
            <RenderColumnHeader sort={sort} columnName={"TotalRecovered"} title={language.total} sortCountries={sortCountries} />
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

const RenderColumnHeader = ({ sort, columnName, title, sortCountries }) => {
  return (
    <th
      className={`sort ${columnName}`}
      style={sort.by === columnName ? { background: "#f39422" } : {}}
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
