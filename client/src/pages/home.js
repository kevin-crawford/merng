import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";

import PostForm from "../components/PostForm";
import { FETCH_POST_QUERY } from "../util/graphql";

// components
import PostCard from "../components/PostCard";
// semantic ui imports
import { Grid, Transition } from "semantic-ui-react";

function Home() {
  const { user } = useContext(AuthContext);
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
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts..</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post, index) => (
                <Grid.Column key={index} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
