const express = require('express')
const authenticate = require('../middleware/auth.js')
const { authorizeCommentOwner } = require('../middleware/authorize.js')
const { deleteComment } = require('../controllers/commentController.js')

const router = express.Router()

// All Role
router.delete('/:id', authenticate(), authorizeCommentOwner, deleteComment)

module.exports = router