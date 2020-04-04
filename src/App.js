import React from "react";
import Summary from "./Summary";
import CountryDetails from "./CountryDetails";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Summary} />
        <Route path="/:slug" component={CountryDetails} />
      </div>
    </Router>
  );
}

export default App;
