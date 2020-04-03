import React, { useEffect, useState } from "react";
import axios from "axios";
import CanvasJSReact from "./assets/canvasjs.react";
import { Helmet } from "react-helmet";
import lang from "./lang";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CountryDetails = props => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (!localStorage.getItem("langCode"))
      localStorage.setItem("langCode", lang.defaultLanguage);
    return localStorage.getItem("langCode");
  });
  const [country, setCountry] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});

  const language = lang[languageCode].CountryDetails;

  const toggleLanguage = code => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  const options = {
    animationEnabled: true,
    // title: {
    //   text: language.title(country)
    // },
    axisY: {
      title: language.affectedPeople,
      includeZero: false
    },
    toolTip: {
      shared: true
    },
    data: [
      {
        type: "line",
        name: language.totalDiagnoses,
        showInLegend: true,
        color: "royalblue",
        dataPoints: data.map(confirmed => ({
          y: confirmed.confirmed,
          label: confirmed.date
        }))
      },
      {
        type: "line",
        name: language.recovered,
        showInLegend: true,
        color: "limegreen",
        dataPoints: data.map(recovered => ({
          y: recovered.recovered,
          label: recovered.date
        }))
      },
      {
        type: "line",
        name: language.deaths,
        showInLegend: true,
        color: "orangered",
        dataPoints: data.map(deaths => ({
          y: deaths.deaths,
          label: deaths.date
        }))
      }
    ]
  };

  const { slug } = props.match.params;

  const getData = country => {
    const confirmedRequest = axios.get(
      `https://api.covid19api.com/total/dayone/country/${country}/status/confirmed`
    );
    const recoveredRequest = axios.get(
      `https://api.covid19api.com/total/dayone/country/${country}/status/recovered`
    );
    const deathsRequest = axios.get(
      `https://api.covid19api.com/total/dayone/country/${country}/status/deaths`
    );

    axios.all([confirmedRequest, recoveredRequest, deathsRequest]).then(
      axios.spread((...responses) => {
        setCountry(responses[1].data[0]?.Country);
        setData(
          responses[0].data.map(confirmed => {
            const recovered = responses[1].data.length
              ? responses[1].data.find(
                  recovered => recovered.Date === confirmed.Date
                )
              : [];
            const deaths = responses[2].data.length
              ? responses[2].data.find(death => death.Date === confirmed.Date)
              : [];

            return {
              date: confirmed.Date.substr(0, 10),
              confirmed: confirmed.Cases,
              recovered: recovered?.Cases || 0,
              deaths: deaths?.Cases || 0
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
      <header>
        <h1>{language.title(country)}</h1>
        <div className="lang">
          {lang.languageList.map(L => (
            <span
              className={languageCode === L.code ? "selected-language" : ""}
              onClick={() => toggleLanguage(L.code)}
            >
              {L.name}
            </span>
          ))}
        </div>
      </header>

      <Helmet>
        <title>{language.title(country)}</title>
        <meta name="description" content={language.description(country)} />
      </Helmet>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default CountryDetails;
