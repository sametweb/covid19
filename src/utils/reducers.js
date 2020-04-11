import {
  FETCH_COUNTRIES_START,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_ERROR,
  SORT_COUNTRIES,
} from "./actions";

const INITIAL_STATE = {
  loading: false,
  stats: {},
  countries: [],
  singleCountryData: [],
  languageCode: "en",
  error: "",
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES_START:
      return { ...state, loading: true, error: "" };
    case FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload.countries,
        stats: action.payload.stats,
        loading: false,
      };
    case FETCH_COUNTRIES_ERROR:
      return { ...state, loading: false, error: "Error loading countries" };
    case SORT_COUNTRIES:
      return { ...state, countries: action.payload };
    default:
      return state;
  }
};
