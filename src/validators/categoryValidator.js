const { checkSchema } = require('express-validator')

const categoryValidator = checkSchema({
    name: {
        notEmpty: {
            errorMessage: "Name is required"
        }
    }
})

module.exports = categoryValidator