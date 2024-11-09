const { checkSchema } = require('express-validator')

const userValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: 'Username is required',
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'Username must be at least 3 characters',
    },
  },
  email: {
    isEmail: {
      errorMessage: 'Please enter a valid email',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  role: {
    in: ['body'],
    isIn: {
      options: ['user', 'admin'],
      errorMessage: "Invalid role, must be one of admin or user"
    },
    notEmpty: {
      errorMessage: "Role is required"
    }
  }
});

module.exports = userValidator