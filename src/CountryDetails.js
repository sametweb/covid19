import React, { useEffect, useState } from "react";
import axios from "axios";
import CanvasJSReact from "./assets/canvasjs.react";
import { Helmet } from "react-helmet";
import lang from "./lang";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
  Legend,
} from "recharts";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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

  const options = {
    animationEnabled: true,
    // title: {
    //   text: language.title(country)
    // },
    axisY: {
      title: language.affectedPeople,
      includeZero: false,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "line",
        name: language.totalDiagnoses,
        showInLegend: true,
        color: "royalblue",
        dataPoints: data.map((confirmed) => ({
          y: confirmed.confirmed,
          label: confirmed.date,
        })),
      },
      {
        type: "line",
        name: language.recovered,
        showInLegend: true,
        color: "limegreen",
        dataPoints: data.map((recovered) => ({
          y: recovered.recovered,
          label: recovered.date,
        })),
      },
      {
        type: "line",
        name: language.deaths,
        showInLegend: true,
        color: "orangered",
        dataPoints: data.map((deaths) => ({
          y: deaths.deaths,
          label: deaths.date,
        })),
      },
    ],
  };

  const { slug } = props.match.params;

  const getData = (country) => {
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
      <Helmet>
        <title>{language.title(country)}</title>
        <meta name="description" content={language.description(country)} />
      </Helmet>
      <h3>COVID-19 Spread in {country}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          width={400}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="confirmed"
            stroke="#2b580c"
            fillOpacity={0.1}
            fill="#2b580c"
          />
        </AreaChart>
      </ResponsiveContainer>
      <h3>Deaths and Recoveries</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          width={400}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="recovered"
            stroke="#537ec5"
            fillOpacity={0.1}
            fill="#537ec5"
          />
          <Area
            type="monotone"
            dataKey="deaths"
            stroke="#f39422"
            fillOpacity={0.1}
            fill="#f39422"
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
      {/* <CanvasJSChart options={options} /> */}
    </div>
  );
};

export default CountryDetails;
