import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { fetchCountries, sortCountries } from "./utils/actions";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "./Header";
import Footer from "./Footer";
import HomePieChart from "./HomePieChart";
import { LanguageContext } from "./App";

export const addComma = (num) => Number(num).toLocaleString();

const Summary = (props) => {
  const { language } = useContext(LanguageContext);
  const { stats, countries } = props;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    firstRender: true,
    by: "TotalConfirmed",
    order: "desc",
  });

  const handleSort = (columnName) => {
    setSort({ by: columnName, order: sort.order === "desc" ? "asc" : "desc" });
  };

  useEffect(() => {
    countries.length === 0 && props.fetchCountries();
  }, []);

  useEffect(() => {
    if (!sort.firstRender) {
      props.sortCountries(countries, sort.order, sort.by);
    }
  }, [sort.by, sort.order]);
  console.log(countries?.filter(({ Country }) => Country.includes("United")));

  return (
    <>
      <Helmet>
        <title>{language.siteTitle}</title>
        <meta name="description" content={language.description} />
      </Helmet>
      <Header />
      <section className="summary">
        <div className="summary-header">
          {language.totalCases}:{" "}
          {!stats.TotalConfirmed ? "..." : addComma(stats.TotalConfirmed)}
        </div>
        <div className="summary-body">
          <div className="summary-item active">
            <p>{language.totalActiveCases}</p>
            <p>
              {!stats.TotalConfirmed ? "..." : addComma(stats.TotalActiveCases)}
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
          <HomePieChart stats={stats} language={language} addComma={addComma} />
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
            {/*prettier-ignore*/}
            <tr>
              <th rowSpan={2}>{language.country}</th>
              <th colSpan={2} className="WideHeader">{language.diagnoses}</th>
              <th colSpan={2} className="WideHeader">{language.deaths}</th>
              <th colSpan={2} className="WideHeader">{language.recovered}</th>
              <th colSpan={1} className="NarrowHeader">{language.diagnoses}</th>
              <th colSpan={1} className="NarrowHeader">{language.deaths}</th>
              <th colSpan={1} className="NarrowHeader">{language.recovered}</th>
            </tr>
            {/* prettier-ignore */}
            <tr>
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
                const {
                  Country,
                  Slug,
                  NewConfirmed,
                  TotalConfirmed,
                  NewRecovered,
                  TotalRecovered,
                  NewDeaths,
                  TotalDeaths,
                } = country;
                //prettier-ignore
                return (
                  <tr key={i} className={`country-table-row${i % 2 ? "-dark" : ""}`}>
                    <td className="country-name"><Link to={Slug}>{Country}</Link></td>
                    <td className={`${NewConfirmed ? "new-confirmed" : ""} NewConfirmed`}>
                      {NewConfirmed ? `+` : ""}
                      {NewConfirmed.toLocaleString()}
                    </td>
                    <td>{TotalConfirmed.toLocaleString()}</td>
                    <td className={`${NewDeaths ? "new-deaths" : ""} NewDeaths`}>
                      {NewDeaths ? `+` : ""}
                      {NewDeaths.toLocaleString()}
                    </td>
                    <td>{TotalDeaths.toLocaleString()}</td>
                    <td className={`${NewRecovered ? "new-recovered" : ""} NewRecovered`}>
                      {NewRecovered ? `+` : ""}
                      {NewRecovered.toLocaleString()}
                    </td>
                    <td>{TotalRecovered.toLocaleString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Footer />
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
