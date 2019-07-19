const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// import our type definitions and resolvers( from the resolvers/index.js export)
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
// Bring in mongodb server string from config
const { MONGODB } = require("./config.js");

// initialize subscription service
const pubSub = new PubSub();

// initialize apollo server with our type definitions, resolvers
// pass context along with the request as the argument
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub })
});

// connect to mongoDB server
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    // if successfull listen to server through port, send console message
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`);
  });
