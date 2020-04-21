import React from "react";
import Summary from "./Summary";
import CountryDetails from "./CountryDetails";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ReactGA from "react-ga";

ReactGA.initialize("UA-146893305-4");
ReactGA.pageview(window.location.pathname + window.location.search);

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
