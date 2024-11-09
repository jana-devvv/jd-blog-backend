const { checkSchema } = require('express-validator')

const registerValidator = checkSchema({
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
});

const loginValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Please enter a valid email',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
});

module.exports = {registerValidator, loginValidator}