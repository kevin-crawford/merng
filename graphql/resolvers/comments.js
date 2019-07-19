const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const Post = require("../../models/Post");

module.exports = {
  // POST MUTATION
  Mutation: {
    // create comment, takes postId, body, and context as args
    createComment: async (_, { postId, body }, context) => {
      // check logged in user using context
      const { username } = checkAuth(context);
      // check if the body of the comment is empty, throw error if so
      if (body.trim() === "") {
        throw new UserInputError("Empty Content", {
          errors: {
            body: "Comment body must not be empty"
          }
        });
      }
      // find post by id using mongoose method and Post model
      const post = await Post.findById(postId);
      // if post exists, unshift(add to front), the new comment
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        // save post, async
        await post.save();
        // return post with new comment
        return post;
      } else throw new UserInputError("Post not found");
    },
    // delete comment
    // takes postId,commentId, and context as args
    async deleteComment(_, { postId, commentId }, context) {
      // check if user is logged in
      const { username } = checkAuth(context);
      // find post by postId in mongoDB and Post model
      const post = await Post.findById(postId);

      // if post exist
      if (post) {
        // go to comments array, find index using the commentId arg and match id in array
        const commentIndex = post.comments.findIndex(c => c.id === commentId);

        // if the comments author matches the logged in user, cut out comment
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          // save post, async
          await post.save();
          // return new post
          return post;
        } else {
          // throw auth error if wrong author
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        // throw error if post not found
        throw new UserInputError("Post not found");
      }
    }
  }
};
