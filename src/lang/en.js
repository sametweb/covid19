//prettier-ignore
export const en = {
  Summary: {
    title: "COVID-19 Worldwide Total Statistics",
    description: 'Daily updated COVID-19 pandemic statistics, browse country by country COVID-19 numbers',
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
      title: (country) => `${country} Daily COVID-19 Statistics Since First Diagnosis`,
      description: (country) => `This page shows COVID-19 statistics for ${country}, day by day virus spread, total diagnoses, recovered cases, and deaths.`,
      affectedPeople: 'Affected People',
      totalDiagnoses: 'Total Diagnoses',
      recovered: 'Recovered',
      deaths: 'Deaths'
  }
};
