const express = require('express')
const upload = require('../middleware/upload.js')
const authenticate = require('../middleware/auth.js')
const multerHandleError = require('../middleware/multerHandleError.js')
const userValidator = require('../validators/userValidator.js')
const { createUser, getAllUsers, uploadAvatar } = require('../controllers/userController.js')
const { authorizeProfileOwner } = require('../middleware/authorize.js')

const router = express.Router()

// All Role
router.get('/', getAllUsers)
router.post('/:id/upload', authenticate(), authorizeProfileOwner, multerHandleError(upload.single('avatar')), uploadAvatar)

// Admin
router.post('/', authenticate('admin'), userValidator, createUser)

module.exports = router