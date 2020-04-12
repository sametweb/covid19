import React, { useState } from "react";
import lang from "./lang";

export const useLanguage = () => {
  const [languageCode, setLanguageCode] = useState(() => {
    const langCode = localStorage.getItem("langCode");
    if (!langCode) {
      localStorage.setItem("langCode", lang.defaultLanguage);
      return lang.defaultLanguage;
    } else {
      if (lang.languageList.find((l) => l.code === langCode)) {
        return langCode;
      } else {
        localStorage.setItem("langCode", lang.defaultLanguage);
        return lang.defaultLanguage;
      }
    }
  });

  const language = lang[languageCode];

  const toggleLanguage = (code) => {
    localStorage.setItem("langCode", code);
    setLanguageCode(localStorage.getItem("langCode"));
  };

  const SelectLanguageDropDown = () => {
    return (
      <div className="lang">
        <label>
          {language.language}:
          <select
            value={languageCode}
            onChange={(e) => toggleLanguage(e.target.value)}
          >
            {lang.languageList.map((L) => (
              <option key={L.code} value={L.code}>
                {L.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  };

  return [language, toggleLanguage, SelectLanguageDropDown];
};
