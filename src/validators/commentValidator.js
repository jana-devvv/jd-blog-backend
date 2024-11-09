const { checkSchema } = require('express-validator')

const commentValidator = checkSchema({
    content: {
        notEmpty: {
            errorMessage: "Content is required"
        }
    }
})

module.exports =  commentValidator