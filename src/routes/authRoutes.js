const express = require('express')
const authenticate = require('../middleware/auth.js')
const { login, logout, register } = require('../controllers/authController.js')
const { loginValidator, registerValidator } = require('../validators/authValidator.js')

const router = express.Router()

// All Role
router.post('/signup', registerValidator, register)
router.post('/signin', loginValidator, login)
router.post('/logout', authenticate(), logout)

module.exports = router