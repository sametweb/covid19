import React, { useEffect } from "react";
import Axios from "axios";

const CountryDetails = props => {
  const { slug } = props.match.params;

  const getData = (country, status) => {
    Axios.get(
      `https://api.covid19api.com/total/country/${country}/status/${status}`
    ).then(res =>
      console.log(
        country,
        status,
        res.data.filter(item => item.Cases)
      )
    );
  };

  useEffect(() => {
    getData(slug, "deaths");
  }, []);

  useEffect(() => {
    getData(slug, "confirmed");
  }, []);

  useEffect(() => {
    getData(slug, "recovered");
  }, []);

  return <div>Country Details</div>;
};

export default CountryDetails;
