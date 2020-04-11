import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetchCountries, sortCountries } from "./utils/actions";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import lang from "./lang";
import { Doughnut } from "react-chartjs-2";
import Header from "./Header";

export const addComma = (num) => Number(num).toLocaleString();

const Summary = (props) => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (!localStorage.getItem("langCode"))
      localStorage.setItem("langCode", lang.defaultLanguage);
    return localStorage.getItem("langCode");
  });
  const { stats, countries } = props;
  console.log({ stats });
  console.log({ countries });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ by: "TotalConfirmed", order: "desc" });

  const language = lang[languageCode];

  const toggleLanguage = (code) => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  const handleSort = (columnName) => {
    setSort({ by: columnName, order: sort.order === "desc" ? "asc" : "desc" });
  };

  useEffect(() => {
    props.fetchCountries();
  }, []);

  useEffect(() => {
    props.sortCountries(countries, sort.order, sort.by);
  }, [sort.by, sort.order]);

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
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        languageCode={languageCode}
        lang={lang}
      />
      <section className="summary">
        <div className="summary-header">
          {language.totalCases}:{" "}
          {!stats.TotalConfirmed ? "..." : addComma(stats.TotalConfirmed)}
        </div>
        <div className="summary-body">
          <div className="summary-item active">
            <p>{language.totalActiveCases}</p>
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
            <p>{language.totalRecoveredCases}</p>
            <p>
              {!stats.TotalRecovered ? "..." : addComma(stats.TotalRecovered)}
            </p>
          </div>
          <div className="summary-item deaths">
            <p>{language.totalDeaths}</p>
            <p>{!stats.TotalDeaths ? "..." : addComma(stats.TotalDeaths)}</p>
          </div>
        </div>
        <div className="summary-chart">
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
            {props.countries
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
      style={
        sort.by === columnName ? { background: "rgba(167, 139, 48, 1)" } : {}
      }
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

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    stats: state.stats,
    countries: state.countries,
    languageCode: state.languageCode,
  };
};

export default connect(mapStateToProps, { fetchCountries, sortCountries })(
  Summary
);
