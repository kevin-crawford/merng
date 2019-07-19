const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");

module.exports = context => {
  // extract authHeader from the context passed in
  const authHeader = context.req.headers.authorization;

  // if header exist, split off the Bearer text, return second item from split(the token)
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    // if token exists
    if (token) {
      try {
        // verify token with secretKey
        const user = jwt.verify(token, SECRET_KEY);
        return user;
        // return the user object
      } catch (err) {
        // throw Error if token is expired/invalid
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    // if token cant split the bearer text, throw error
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  // if it cannot find the auth header, throw error
  throw new Error("Authorization token must be provided");
};
