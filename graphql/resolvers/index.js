const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  // POST mutatator that returns the length of likes to create a like count
  // do the same for comment count using arrow function
  Post: {
    likeCount(parent) {
      console.log(parent);
      return parent.likes.length;
    },
    commentCount: parent => parent.comments.length
  },
  // QUERIES
  Query: {
    // add posts query to query object in this export
    ...postsResolvers.Query
  },
  // MUTATIONS
  Mutation: {
    // spread operator all the user, post, comment resolver mutations
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  // SUBSCRIPTION
  Subscription: {
    // spread operator all the posts subscription methods
    ...postsResolvers.Subscription
  }
};
