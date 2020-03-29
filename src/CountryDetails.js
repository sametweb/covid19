import React, { useEffect, useState } from "react";
import axios from "axios";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CountryDetails = props => {
  const [country, setCountry] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});

  const options = {
    animationEnabled: true,
    title: {
      text: `İlk tanıdan itibaren günlük ${country} COVID-19 istatistikleri`
    },
    axisY: {
      title: "Etkilenen insan sayısı",
      includeZero: false
    },
    toolTip: {
      shared: true
    },
    data: [
      {
        type: "area",
        name: "Toplam Tanılar",
        showInLegend: true,
        dataPoints: data.map(confirmed => ({
          y: confirmed.confirmed,
          label: confirmed.date
        }))
      },
      {
        type: "area",
        name: "İyileşenler",
        showInLegend: true,
        dataPoints: data.map(recovered => ({
          y: recovered.recovered,
          label: recovered.date
        }))
      },
      {
        type: "area",
        name: "Ölümler",
        showInLegend: true,
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

  console.log(data);

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default CountryDetails;
