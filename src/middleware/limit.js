const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        code: 429,
        status: 'Error',
        message: 'Too many requests, please try again later.'
    }
})

module.exports = limiter