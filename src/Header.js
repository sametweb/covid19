import React from "react";

const Header = ({ language, toggleLanguage, languageCode, lang }) => {
  return (
    <header>
      <h1 className="title">{language.siteTitle}</h1>
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
    </header>
  );
};

export default Header;
