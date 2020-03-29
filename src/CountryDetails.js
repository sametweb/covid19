import React, { useEffect, useState } from "react";
import axios from "axios";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CountryDetails = props => {
  const [data, setData] = useState([
    { date: "", confirmed: "", recovered: "", deaths: "" }
  ]);
  const [confirmed, setConfirmed] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const [deaths, setDeaths] = useState([]);

  const options = {
    animationEnabled: true,
    title: {
      text: ""
    },
    axisY: {
      title: "Number of Cases",
      includeZero: false
    },
    toolTip: {
      shared: true
    },
    data: [
      {
        type: "spline",
        name: "Total Cases",
        showInLegend: true,
        dataPoints: confirmed
      },
      {
        type: "spline",
        name: "Recovered Cases",
        showInLegend: true,
        dataPoints: recovered
      },
      {
        type: "spline",
        name: "Deaths",
        showInLegend: true,
        dataPoints: deaths
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

    axios
      .all([confirmedRequest, recoveredRequest, deathsRequest])
      .then(
        axios.spread((...responses) => {
          const confirmedData = responses[0].map(conf => ({
            y: conf.Cases,
            label: conf.Date.substr(0, 10)
          }));
          const recoveredData = responses[1].map(rec => ({
            y: rec.Cases,
            label: rec.Date.substr(0, 10)
          }));
          const deathsData = responses[2].map(death => ({
            y: death.Cases,
            label: death.Date.substr(0, 10)
          }));
          console.log({ confirmedData, recoveredData, deathsData });
        })
      )
      .catch(err => console.log("THEREIS ERROR"));

    // axios
    //   .get()
    //   .then(res => {
    //     setConfirmed(
    //       res.data
    //         .filter(item => item.Cases)
    //         .map(({ Cases, Date }) => {
    //           return { y: Cases, label: Date.substr(0, 10) };
    //         })
    //     );
    //     return axios.get();
    //   })
    //   .then(res => {
    //     setRecovered(
    //       res.data
    //         .filter(item => item.Cases)
    //         .map(({ Cases, Date }) => {
    //           return { y: Cases, label: Date.substr(0, 10) };
    //         })
    //     );
    //     return axios.get();
    //   })
    //   .then(res => {
    //     setDeaths(
    //       res.data
    //         .filter(item => item.Cases)
    //         .map(({ Cases, Date }) => {
    //           return { y: Cases, label: Date.substr(0, 10) };
    //         })
    //     );
    //   });
  };

  useEffect(() => {
    getData(slug);
  }, [slug]);

  console.log({ data });

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default CountryDetails;
