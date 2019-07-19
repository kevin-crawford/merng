const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput } = require("../../util/validators");
const { validateLoginInput } = require("../../util/validators");
const { SECRET_KEY } = require("../../config");

const User = require("../../models/User");

// helper function that generates auth token, takes user as an arg
function generateToken(user) {
  // sign token, add user payload, pass secret key, expire it in 1h.
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  // USER MUTATIONS
  Mutation: {
    // login user, takes username and password as args
    async login(_, { username, password }) {
      // validate username and password provided through validator function in util
      const { errors, valid } = validateLoginInput(username, password);
      // find user using User model and mongoose method findOne
      const user = await User.findOne({ username });

      // if validation function returns valid as false, throw UserInputError with array of errors
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // if mongoose cannot find user, add a general error to errors object
      if (!user) {
        errors.general = "User not found";
        // throw the user input error
        throw new UserInputError("User not found", { errors });
      }

      // await for bcrypt to compare user.password(from DB), to password provided in the args
      const match = await bcrypt.compare(password, user.password);
      // if they dont match, throw general error
      if (!match) {
        errors.general = "Wrong Credentails";
        throw new UserInputError("Wrong Credentails", { errors });
      }

      // if they passwords do match, generate auth token
      const token = generateToken(user);

      // return user document from database, the user id from db, and auth token
      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    // REGISTER USER
    async register(
      _,
      {
        // destructure info from register input to sign up a new user
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // run args through validator function to make sure there is no empty fields
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      // if not valid, throw userinputerror with the error object
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // find user in DB
      const user = await User.findOne({ username });
      // if this user is already in DB, throw error
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken"
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      // create new user object using the User model
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      // save user as a response variable
      const res = await newUser.save();

      // generate token using the res variable
      const token = generateToken(res);

      // return the user info from db, id from db and auth token
      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
