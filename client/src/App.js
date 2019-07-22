import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// components
import MenuBar from "./components/MenuBar";
import AuthRoute from "./util/AuthRoute";

// AUTHORIZATION PROVIDER
import { AuthProvider } from "./context/auth";

// page views
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

// CSS semantic ui styling, add semantic class names to enable
import "semantic-ui-css/semantic.min.css";
import "./App.css";

// holds all of our routes and static page view components
// all routes have auth context wrapped around the component
// which we can use to get user data from

// login and register are passed through AuthRoute HOC to check if user is already logged in
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
