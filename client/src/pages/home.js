import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// components
import PostCard from "../components/PostCard";
// semantic ui imports
import { Grid, Image } from "semantic-ui-react";

function Home() {
  // we destructure our query response, we need loading and the getPost query data
  const {
    loading,
    data: { getPosts: posts }
  } = useQuery(FETCH_POST_QUERY);

  // return home layout
  // if loading variable is true, show loading posts...
  // else map over our posts from the query and pass the post data into our PostCard Component
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading Posts..</h1>
        ) : (
          posts &&
          posts.map((post, index) => (
            <Grid.Column key={index} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POST_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
