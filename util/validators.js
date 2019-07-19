module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  // init error object
  const errors = {};
  // check if username is empty, if true, add username error to errors object
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  // check if email is empty
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    // if email is not empty, make sure its a valid email
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  // check if password is empty
  if (password === "") {
    errors.password = "Password must not be empty";
    // check if password matches the confirmPassword
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }
  // return the errors object
  // also return a valid variable which is true if the errors object has no length
  // else return false for valid
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateLoginInput = (username, password) => {
  // init errors object
  const errors = {};
  // check if username is empty
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  // check if password is empty
  if (password === "") {
    errors.password = "Password must not be empty";
  }

  // return errors object and valid variable

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
