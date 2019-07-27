import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POST_QUERY } from "../util/graphql";

//
function PostForm() {
  // use the customer form hook we created for login/register logic
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ""
  });

  // pull the created post and any errors from the apollo mutation
  // pass our graph ql query as an arg, along with the form values as variables
  // update function
  // proxy will read the fetch post query
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      // set data variable to
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POST_QUERY, data });
      // set values back to empty
      values.body = "";
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="hi world!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
