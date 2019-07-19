const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  // QUERY POSTS
  Query: {
    // query all posts
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    // query one post
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      // check if user is logged in using helper function checkAuth
      const user = checkAuth(context);

      // check if post body is empty
      if (arguments.body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      // create new post object using the Post model
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      // save post, async
      const post = await newPost.save();

      // we can subscribe to getting updates for any new posts using pubSub
      context.pubSub.publish("NEW_POST", {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      // check if user is logged in
      const user = checkAuth(context);

      try {
        // find post
        const post = await Post.findById(postId);
        // make sure logged in user is the post author
        if (user.username === post.username) {
          // async delete method
          await post.delete();
          // return a response
          return "Post deleted";
        } else {
          // if not author, throw auth error
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        // catch errors
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      // check logged in user creds
      const { username } = checkAuth(context);
      // find post
      const post = await Post.findById(postId);
      // toggle like/unlike through if else statement
      if (post) {
        // if logged in user is already in likes array of the post
        if (post.likes.find(like => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // Not Liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        // save post, async
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    }
  },
  // SUBSCRIPTION resolver, using an async iterator
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator(`NEW_POST`)
    }
  }
};
