import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

// component which checks if a user is logged in
// if logged in, redirect user to home page
// users should not be able to use login and register pages if they are already logged in

function AuthRoute({ component: Component }, ...rest) {
  // get user from auth context
  const { user } = useContext(AuthContext);

  // return a route which has any props from component
  // renders  component if not logged in
  // renders a redirect route component to home page if logged in
  // pass the rest of the props

  return (
    <Route
      {...rest}
      render={props => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  );
}

export default AuthRoute;
