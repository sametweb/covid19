import React, { createContext } from "react";
import Summary from "./Summary";
import CountryDetails from "./CountryDetails";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLanguage } from "./useLanguage";

export const LanguageContext = createContext();

function App() {
  const [language, toggleLanguage, SelectLanguageDropDown] = useLanguage();
  return (
    <Router>
      <LanguageContext.Provider
        value={{ language, toggleLanguage, SelectLanguageDropDown }}
      >
        <div className="App">
          <Route path="/" exact component={Summary} />
          <Route path="/:slug" component={CountryDetails} />
        </div>
      </LanguageContext.Provider>
    </Router>
  );
}

export default App;
