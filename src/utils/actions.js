import axios from "axios";

export const FETCH_COUNTRIES_START = "FETCH_COUNTRIES_START";
export const FETCH_COUNTRIES_SUCCESS = "FETCH_COUNTRIES_SUCCESS";
export const FETCH_COUNTRIES_ERROR = "FETCH_COUNTRIES_ERROR";

export const SORT_COUNTRIES = "SORT_COUNTRIES";

export const FETCH_SINGLE_COUNTRY_START = "FETCH_SINGLE_COUNTRY_START";
export const FETCH_SINGLE_COUNTRY_SUCCESS = "FETCH_SINGLE_COUNTRY_SUCCESS";
export const FETCH_SINGLE_COUNTRY_ERROR = "FETCH_SINGLE_COUNTRY_ERROR";

export const FETCH_COMPARE_COUNTRY_START = "FETCH_COMPARE_COUNTRY_START";
export const FETCH_COMPARE_COUNTRY_SUCCESS = "FETCH_COMPARE_COUNTRY_SUCCESS";
export const FETCH_COMPARE_COUNTRY_ERROR = "FETCH_COMPARE_COUNTRY_ERROR";

export const fetchCountries = () => (dispatch) => {
  dispatch({ type: FETCH_COUNTRIES_START });
  axios
    .get("https://api.covid19api.com/summary")
    .then((res) => {
      const sorted = [
        ...res.data.Countries.sort(
          (a, b) => b.TotalConfirmed - a.TotalConfirmed
        ),
      ];
      dispatch({
        type: FETCH_COUNTRIES_SUCCESS,
        payload: {
          countries: sorted,
          stats: {
            ...res.data.Global,
            TotalActiveCases:
              res.data.Global.TotalConfirmed -
              res.data.Global.TotalRecovered -
              res.data.Global.TotalDeaths,
          },
        },
      });
    })
    .catch((err) => dispatch({ type: FETCH_COUNTRIES_ERROR, payload: err }));
};

export const sortCountries = (countries, order, by) => {
  const sorted = [
    ...countries.sort((a, b) =>
      order === "desc" ? b[by] - a[by] : a[by] - b[by]
    ),
  ];
  return { type: SORT_COUNTRIES, payload: sorted };
};

export const fetchSingleCountry = (countrySlug) => (dispatch) => {
  dispatch({ type: FETCH_SINGLE_COUNTRY_START });
  const confirmedRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/confirmed`
  );
  const recoveredRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/recovered`
  );
  const deathsRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/deaths`
  );

  axios
    .all([confirmedRequest, recoveredRequest, deathsRequest])
    .then(
      axios.spread((...responses) => {
        const countryName = responses[1].data[0]?.Country;
        const countryData = responses[0].data.map((confirmed) => {
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
        });
        dispatch({
          type: FETCH_SINGLE_COUNTRY_SUCCESS,
          payload: { countryName, countryData },
        });
      })
    )
    .catch((err) =>
      dispatch({ type: FETCH_SINGLE_COUNTRY_ERROR, payload: err })
    );
};

export const fetchCompareCountry = (countrySlug) => (dispatch) => {
  dispatch({ type: FETCH_COMPARE_COUNTRY_START });
  const confirmedRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/confirmed`
  );
  const recoveredRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/recovered`
  );
  const deathsRequest = axios.get(
    `https://api.covid19api.com/total/country/${countrySlug}/status/deaths`
  );

  axios
    .all([confirmedRequest, recoveredRequest, deathsRequest])
    .then(
      axios.spread((...responses) => {
        const countryName = responses[1].data[0]?.Country;
        const countryData = responses[0].data.map((confirmed) => {
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
        });
        dispatch({
          type: FETCH_COMPARE_COUNTRY_SUCCESS,
          payload: { countryName, countryData },
        });
      })
    )
    .catch((err) =>
      dispatch({ type: FETCH_COMPARE_COUNTRY_ERROR, payload: err })
    );
};
