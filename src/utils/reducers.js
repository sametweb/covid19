import {
  FETCH_COUNTRIES_START,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_ERROR,
  SORT_COUNTRIES,
  FETCH_SINGLE_COUNTRY_START,
  FETCH_SINGLE_COUNTRY_SUCCESS,
  FETCH_SINGLE_COUNTRY_ERROR,
  FETCH_COMPARE_COUNTRY_START,
  FETCH_COMPARE_COUNTRY_SUCCESS,
  FETCH_COMPARE_COUNTRY_ERROR,
} from "./actions";

const INITIAL_STATE = {
  loading: false,
  stats: {},
  countries: [],
  singleCountry: { countryName: "", countryData: [] },
  compareCountry: { countryName: "", countryData: [] },
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
    case FETCH_SINGLE_COUNTRY_START:
      return {
        ...state,
        loading: true,
        singleCountry: INITIAL_STATE.singleCountry,
        compareCountry: INITIAL_STATE.compareCountry,
        error: "",
      };
    case FETCH_SINGLE_COUNTRY_SUCCESS:
      return { ...state, singleCountry: action.payload, loading: false };
    case FETCH_SINGLE_COUNTRY_ERROR:
      return { ...state, loading: false, error: action.payload };
    case FETCH_COMPARE_COUNTRY_START:
      return { ...state, loading: true, error: "" };
    case FETCH_COMPARE_COUNTRY_SUCCESS:
      return { ...state, compareCountry: action.payload, loading: false };
    case FETCH_COMPARE_COUNTRY_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
