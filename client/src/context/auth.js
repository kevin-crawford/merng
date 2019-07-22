import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null
};
if (localStorage.getItem("jwtToken")) {
  // if we recieve token from local storage, decode the token
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  // if tokens expiration date is less than the current time
  // remove token from local storage
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}
// create a initial state for context
// user is null, login takes in data, returns nothing
// logout is an empty function
const AuthContext = createContext({
  user: null,
  login: data => {},
  logout: () => {}
});

// AUTH REDUCER
// Takes in state and an action
// switch case by action.type and return the state and set any existing state
// to the new action.payload
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

// AuthProvider function which we used to wrap any components that need authorization
function AuthProvider(props) {
  // we use the auth reducer which needs state and action dispatch
  const [state, dispatch] = useReducer(authReducer, initialState);

  // function which takes user data to log in
  // payload is the user data

  // add jwt token to local storage so we can persist user sessions in the client
  // this makes sure we dont have to log in everytime the page refreshes
  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({ type: "LOGIN", payload: userData });
  }

  // logout function which calls the auth reducer to set the user back to null
  // remove jwt token from local storage
  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  }

  // return the auth context provider which has values from state, the login/logout functions
  // spread any other props using spread operator
  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

// export both auth context and auth provider
export { AuthContext, AuthProvider };
