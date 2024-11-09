const { checkSchema } = require('express-validator')

const postValidator = checkSchema({
  title: {
    notEmpty: {
      errorMessage: 'Title is required',
    },
  },
  content: {
    notEmpty: {
      errorMessage: 'Content is required',
    },
  },
  categoryId: {
    notEmpty: {
      errorMessage: 'Category is required',
    },
  },
});

module.exports = postValidator