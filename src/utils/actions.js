import axios from "axios";

export const FETCH_COUNTRIES_START = "FETCH_COUNTRIES_START";
export const FETCH_COUNTRIES_SUCCESS = "FETCH_COUNTRIES_SUCCESS";
export const FETCH_COUNTRIES_ERROR = "FETCH_COUNTRIES_ERROR";
export const SORT_COUNTRIES = "SORT_COUNTRIES";

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
        payload: { countries: sorted, stats: res.data.Global },
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
