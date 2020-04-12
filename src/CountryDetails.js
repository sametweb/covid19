import React, { useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Line } from "react-chartjs-2";
import { addComma } from "./Summary";
import Header from "./Header";
import { LanguageContext } from "./App";
import { connect } from "react-redux";
import {
  fetchCountries,
  fetchSingleCountry,
  fetchCompareCountry,
} from "./utils/actions";

const CountryDetails = (props) => {
  const { language } = useContext(LanguageContext);
  const { countryName, countryData } = props.singleCountry;
  const { compareCountry } = props;
  const { slug } = props.match.params;

  useEffect(() => {
    props.countries.length === 0 && props.fetchCountries();
  }, []);

  useEffect(() => {
    props.fetchSingleCountry(slug);
  }, [slug]);

  const produceTotalCaseNumber = (countryData, type) => {
    const data = countryData[countryData.length - 1];
    return data ? data[type].toLocaleString() : "";
  };

  const produceNewCaseNumber = (countries, countryName, type) => {
    const country = countries.find(
      (country) => country.Country === countryName
    );
    return country
      ? `+${country[type].toLocaleString()} ${language.today}`
      : "";
  };

  const produceData = (label, data, rgb, dataName) => ({
    label,
    data: data.map((a) => a[dataName]),
    backgroundColor: [`rgba(${rgb}, 0.3)`],
    borderColor: [`rgba(${rgb}, 0.7)`],
    borderWidth: 1,
    pointRadius: 2,
    pointHoverRadius: 4,
    pointBackgroundColor: `rgba(${rgb}, 0.5)`,
  });

  const produceOptions = (title) => ({
    title: {
      display: true,
      text: title,
      fontSize: 16,
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
            b.datasets[a.datasetIndex].data[a.index]
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
  });

  //prettier-ignore
  const countryTotalCasesDataset = !compareCountry.countryName
    ? [{...produceData(countryName, countryData, "48, 105, 167", "confirmed")}]
    : [
        {...produceData(countryName, countryData, "48, 105, 167", "confirmed")},
        {...produceData(compareCountry.countryName, compareCountry.countryData, "179, 0, 0", "confirmed")}
      ];

  //prettier-ignore
  const countryRecoveredDataset = !compareCountry.countryName
    ? [{...produceData(countryName, countryData, "78, 167, 48", "recovered")}]
    : [
        {...produceData(countryName, countryData, "48, 105, 167", "recovered")},
        {...produceData(compareCountry.countryName, compareCountry.countryData, "179, 0, 0", "recovered")}
      ];

  //prettier-ignore
  const countryDeathsDataset = !compareCountry.countryName
    ? [{...produceData(countryName, countryData, "167, 48, 48", "deaths")}]
    : [
        {...produceData(countryName, countryData, "48, 105, 167", "deaths")},
        {...produceData(compareCountry.countryName, compareCountry.countryData, "179, 0, 0", "deaths")}
      ];

  return (
    <div>
      <Header />
      <Helmet>
        <title>{language.singleCountryTitle}</title>
        <meta name="description" content={language.description} />
      </Helmet>
      <div className="single-country-header">
        <h2>{countryName}</h2>
        <label htmlFor="countryToCompare">
          {language.compareTo}
          <select
            id="countryToCompare"
            onChange={(e) => props.fetchCompareCountry(e.target.value)}
          >
            <option value="">{language.select}</option>
            {props.countries
              .filter(({ Country }) => Country !== countryName)
              .map((country) => (
                <option key={country.Slug} value={country.Slug}>
                  {country.Country}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="single-country-subheader">
        <div className="box active">
          <span className="title">{language.totalCases}</span>
          <span className="total-number">
            {produceTotalCaseNumber(countryData, "confirmed")}
          </span>
          <span className="new-number">
            {produceNewCaseNumber(props.countries, countryName, "NewConfirmed")}
          </span>
        </div>
        <div className="box recovered">
          <span className="title">{language.totalRecoveredCases}</span>
          <span className="total-number">
            {produceTotalCaseNumber(countryData, "recovered")}
          </span>
          <span className="new-number">
            {produceNewCaseNumber(props.countries, countryName, "NewRecovered")}
          </span>
        </div>
        <div className="box deaths">
          <span className="title">{language.totalDeaths}</span>
          <span className="total-number">
            {produceTotalCaseNumber(countryData, "deaths")}
          </span>
          <span className="new-number">
            {produceNewCaseNumber(props.countries, countryName, "NewDeaths")}
          </span>
        </div>
      </div>
      {props.compareCountry.countryName && (
        <div className="single-country-subheader">
          <h3>{props.compareCountry.countryName}</h3>
          <div className="box active">
            <span className="title">{language.totalCases}</span>

            <span className="total-number">
              {produceTotalCaseNumber(
                props.compareCountry.countryData,
                "confirmed"
              )}
            </span>
            <span className="new-number">
              {produceNewCaseNumber(
                props.countries,
                props.compareCountry.countryName,
                "NewConfirmed"
              )}
            </span>
          </div>
          <div className="box recovered">
            <span className="title">{language.totalRecoveredCases}</span>

            <span className="total-number">
              {produceTotalCaseNumber(
                props.compareCountry.countryData,
                "recovered"
              )}
            </span>
            <span className="new-number">
              {produceNewCaseNumber(
                props.countries,
                props.compareCountry.countryName,
                "NewRecovered"
              )}
            </span>
          </div>
          <div className="box deaths">
            <span className="title">{language.totalDeaths}</span>

            <span className="total-number">
              {produceTotalCaseNumber(
                props.compareCountry.countryData,
                "deaths"
              )}
            </span>
            <span className="new-number">
              {produceNewCaseNumber(
                props.countries,
                props.compareCountry.countryName,
                "NewDeaths"
              )}
            </span>
          </div>
        </div>
      )}

      <Line
        data={{
          labels: countryData.map((a) => a.date),
          datasets: [...countryTotalCasesDataset],
        }}
        options={produceOptions(language.dailySpread)}
      />
      <div className="smaller-charts">
        <div className="chart-container">
          <Line
            data={{
              labels: countryData.map((a) => a.date.substr(a.date.length - 5)),
              datasets: [...countryRecoveredDataset],
            }}
            options={produceOptions(language.recovered)}
          />
        </div>
        <div className="chart-container">
          <Line
            data={{
              labels: countryData.map((a) => a.date.substr(a.date.length - 5)),
              datasets: [...countryDeathsDataset],
            }}
            options={produceOptions(language.deaths)}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    singleCountry: state.singleCountry,
    countries: state.countries,
    compareCountry: state.compareCountry,
  };
};

export default connect(mapStateToProps, {
  fetchCountries,
  fetchSingleCountry,
  fetchCompareCountry,
})(CountryDetails);
