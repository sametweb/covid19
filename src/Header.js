import React, { useContext } from "react";
import { LanguageContext } from "./App";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const Header = (props) => {
  const { language, SelectLanguageDropDown } = useContext(LanguageContext);

  return (
    <header>
      {props.loading && <div className="loading" />}
      <h1 className="title">
        <Link to="/">{language.siteTitle}</Link>
      </h1>
      <SelectLanguageDropDown />
    </header>
  );
};

const mapStateToProps = (state) => ({
  loading: state.loading,
});

export default connect(mapStateToProps)(Header);
