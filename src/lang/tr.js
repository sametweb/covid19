//prettier-ignore
export const tr = {
    Summary: {
      title: "Dünya Geneli Toplam COVID-19 İstatistikleri",
      description: 'Günlük güncellenen COVID-19 salgını istatistikleri, ülke bazlı COVID-19 rakamlarını görüntüleyin',
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
      title: (country) => `İlk Teşhisten İtibaren ${country} Günlük COVID-19 İstatistikleri`,
      description: (country) => `Bu sayfa ${country} için COVID-19 istatistiklerini içerir, gün gün virüsün yayılımı, toplam teşhis sayıları, iyileşenler, ve ölümler.`,
      affectedPeople: 'Etkilenen kişi sayısı',
      totalDiagnoses: 'Toplam Teşhisler',
      recovered: 'İyileşenler',
      deaths: 'Ölümler'
    }
  };
