import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// components
import MenuBar from "./components/MenuBar";

// page views
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="ui container">
        <MenuBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;
