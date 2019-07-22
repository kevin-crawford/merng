import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { useForm } from "../util/hooks";

import { AuthContext } from "../context/auth";

function Login(props) {
  const context = useContext(AuthContext);
  // errors hook
  // state is empty at render
  const [errors, setErrors] = useState({});

  // destrucutre onChange , onSubmit, values from custom useForm hook
  // initial state starts as empty strings, onChange and on submission, values are modified
  // values are sent back from custom hook
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: ""
  });

  // array destructuring from useMutation hook provided by apollo
  // pass our graphql mutation as first argument (bottom of page)
  // pass object that includes methods for update and on Error
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // update function can take a parent and result
    // we only use update function to push logged in user to home page
    update(
      _,
      {
        data: { login: userData }
      }
    ) {
      context.login(userData);
      props.history.push("/");
    },
    // if any errors come back, we grab errors from array
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    //pass property variables with values as its value
    variables: values
  });

  // callback function which calls loginUser
  // we had to pass this function through our custom hook to get updated form values prior to calling useMutation
  // which logs in the user
  function loginUserCallback() {
    loginUser();
  }

  // return form component
  // Form takes an onSubmit handler, will have classname of loading if loading is true
  // Form Inputs take value prop to pass to custom form hook
  // Form inputs take an error prop which is set to true when the errors object returns
  // a specific error property that is the name of the input
  // we show errors below form if the errors object has any length
  // map through all errors and show them in an list
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
