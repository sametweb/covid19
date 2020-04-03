//prettier-ignore
export const en = {
  Summary: {
    title: "COVID-19 Worldwide Total Statistics",
    subtitle: num => `Total ${Number(num).toLocaleString()} people 
        worldwide has been diagnosed with COVID-19.`,
    activeDiagnoses: 'Active Diagnoses',
    recovered: 'Recovered',
    deaths: 'Deaths',
    statsByCountry: 'COVID-19 Statistics by Country',
    searchPlaceholder: 'search in countries',
    clear: 'Clear',
    country: 'Country',
    diagnoses: 'Diagnoses',
    new: 'New',
    total: 'Total'
  },
  CountryDetails: {
      chartTitle: (country) => `${country} Daily COVID-19 Statistics Since First Diagnosis`,
      affectedPeople: 'Affected People',
      totalDiagnoses: 'Total Diagnoses',
      recovered: 'Recovered',
      deaths: 'Deaths',

  }
};
