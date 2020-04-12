import React, { useContext } from "react";
import { LanguageContext } from "./App";
import { Link } from "react-router-dom";

const Header = () => {
  const { language, SelectLanguageDropDown } = useContext(LanguageContext);

  return (
    <header>
      <h1 className="title">
        <Link to="/">{language.siteTitle}</Link>
      </h1>
      <SelectLanguageDropDown />
    </header>
  );
};

export default Header;
