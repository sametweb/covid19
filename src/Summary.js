import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Summary = props => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then(res => {
        const data = res.data.Countries.filter(
          country => country.Country && country.TotalConfirmed > 0
        ).map(country =>
          country.Country === "US"
            ? { ...country, Country: "United States of America" }
            : country
        );
        setCountries(data);
      })
      .catch(err => console.log(err));
  }, []);
  console.log({ search });
  return (
    <div>
      <h1>COVID-19 Ülke Bazında İstatistikler</h1>
      <div className="search">
        <input
          placeholder="ülkelerde ara"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")}>Temizle</button>
      </div>
      <table>
        <tbody>
          <tr
            style={{
              backgroundColor: "#333",
              color: "white",
              height: 30
            }}
          >
            <th>Ülke</th>
            <th>Yeni Tanılar</th>
            <th>Toplam Tanılar</th>
            <th>Yeni Ölümler</th>
            <th>Toplam Ölümler</th>
            <th>Yeni İyileşenler</th>
            <th>Toplam İyileşenler</th>
          </tr>
          {countries
            .filter(({ Country }) =>
              Country.toLowerCase().includes(search.toLowerCase())
            )
            .map((country, i) => {
              return (
                <tr key={i} style={i % 2 ? { backgroundColor: "#f1f1f2" } : {}}>
                  <td>
                    <Link to={country.Slug}>{country.Country}</Link>
                  </td>
                  <td
                    style={
                      country.NewConfirmed ? { color: "rgb(168, 137, 45)" } : {}
                    }
                  >
                    {country.NewConfirmed
                      ? `+${country.NewConfirmed}`
                      : country.NewConfirmed}
                  </td>
                  <td>{country.TotalConfirmed}</td>
                  <td style={country.NewDeaths ? { color: "crimson" } : {}}>
                    {country.NewDeaths
                      ? `+${country.NewDeaths}`
                      : country.NewDeaths}
                  </td>
                  <td>{country.TotalDeaths}</td>
                  <td style={country.NewRecovered ? { color: "green" } : {}}>
                    {country.NewRecovered
                      ? `+${country.NewRecovered}`
                      : country.NewRecovered}
                  </td>
                  <td>{country.TotalRecovered}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
