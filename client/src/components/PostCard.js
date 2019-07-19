import React from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

// destructure our post data directly in the PostCard components argument
// we can do this because we know exactly what data we are receiving from props
function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
  // onclick function for like button
  function likePost() {
    console.log("liked post!");
  }
  // onclick handler for commenting on post
  function commentOnPost() {
    console.log("comment on post");
  }

  // return our postcard component
  // Username as header, createdAt as meta info that also acts as a link
  // data body as description
  // like count/ button and comment count/ button for extra content

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="teal" basic>
            <Icon name="heart" />
          </Button>
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentOnPost}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
