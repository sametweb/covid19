import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Summary = props => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then(res => setCountries(res.data.Countries))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>COVID-19 İstatistikler</h1>
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
          <tr>
            <th>Ülke</th>
            <th>Yeni Tanılar</th>
            <th>Toplam Tanılar</th>
            <th>Yeni Ölümler</th>
            <th>Toplam Ölümler</th>
            <th>Yeni İyileşenler</th>
            <th>Toplam İyileşenler</th>
          </tr>
          {countries
            .filter(country =>
              country.Country.toLowerCase().includes(search.toLowerCase())
            )
            .map((country, i) => {
              return (
                <tr
                  key={country.Slug}
                  style={i % 2 === 0 ? { backgroundColor: "#e1e1e2" } : {}}
                >
                  <td>
                    <Link to={country.Slug}>{country.Country}</Link>
                  </td>
                  <td>{country.NewConfirmed}</td>
                  <td>{country.TotalConfirmed}</td>
                  <td>{country.NewDeaths}</td>
                  <td>{country.TotalDeaths}</td>
                  <td>{country.NewRecovered}</td>
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
