import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { useForm } from "../util/hooks";

function Login(props) {
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
    update(_, result) {
      props.history.push("/");
    },
    // if any errors come back, we grab errors from array
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

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
