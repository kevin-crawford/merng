const { gql } = require("apollo-server");

// TYPE DEFINITIONS FOR GRAPHQL

// POST has relationship with LIKE, COMMENT
// input REGISTERINPUT is created because we want to seperate that
// information from the actuall  User type.

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;

// DEFINE OUR QUERY TYPE, getPosts(should be an array of type post),
// getPost (single post that takes postId as an arg)

// DEFINE MUTATIONS
// register(takes an input type registerInput) returns User, required
// login(username, password arguments) returns User type, required
// createPost(body as argument): returns Post type , required
// deletePost(postId as argument): returns a String
// createComment(postId, commentId as arguments): returns Post type
// deleteComment(postId, commentId as arguments): returns Post type
// likePost(postId as argument): returns Post type, toggle method, true : false

// Subscription
// newPost returns a Post Type
