//prettier-ignore
export const tr = {
    Summary: {
      title: "Dünya Geneli Toplam COVID-19 İstatistikleri",
      subtitle: num => `Dünya genelinde toplam ${Number(num).toLocaleString()} kişiye COVID-19 teşhisi konulmuştur.`,
      activeDiagnoses: 'Aktif Teşhisler',
      recovered: 'İyileşenler',
      deaths: 'Ölümler',
      statsByCountry: 'Ülke Bazlı COVID-19 İstatistikleri',
      searchPlaceholder: 'ülkelerde ara',
      clear: 'Temizle',
      country: 'Ülke',
      diagnoses: 'Teşhisler',
      new: 'Yeni',
      total: 'Toplam'
    },
    CountryDetails: {
        chartTitle: (country) => `İlk Teşhisten İtibaren ${country} Günlük COVID-19 İstatistikleri`,
        affectedPeople: 'Etkilenen kişi sayısı',
        totalDiagnoses: 'Toplam Teşhisler',
        recovered: 'İyileşenler',
        deaths: 'Ölümler',
  
    }
  };
