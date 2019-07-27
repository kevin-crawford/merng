import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

// SEMANTIC UI
import { Button, Icon, Label } from "semantic-ui-react";

// destructure user and post from arguments
function LikeButton({ user, post: { id, likeCount, likes } }) {
  // hook for likes
  // initial state is false
  const [liked, setLiked] = useState(false);

  // if user is logged in(by checking user from args)
  // if the likes array includes a like from the logged in user
  // set like to true
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
      // else set liked to false
    } else setLiked(false);
    // user and likes are our constants in use Effect
  }, [user, likes]);

  // set likePost array, to our LIKE POST MUTATION
  // we also bring along the postId from the args as a variable to the mutation
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  // if user is logged in AND user has already liked the post, set button icon to solid teal color
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      // if user is logged in and not liked post, set to hollow teal color
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    // if user is not logged in, set like button to redirect user to login page
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
