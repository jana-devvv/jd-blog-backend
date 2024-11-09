const express = require('express')
const upload = require('../middleware/upload.js')
const authenticate = require('../middleware/auth.js')
const multerHandleError = require('../middleware/multerHandleError.js')
const postValidator = require('../validators/postValidator.js')
const commentValidator = require('../validators/commentValidator.js')
const { createPost, deletePost, getAllPosts, getPostById, updatePost, uploadImage, getPostDrafts } = require('../controllers/postController.js')
const { createComment, getCommentByPost } = require('../controllers/commentController.js')
const { authorizePostOwner } = require('../middleware/authorize.js')

const router = express.Router()

// Post - All Role
router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.get('/drafts', authenticate(), getPostDrafts)
router.post('/:id/upload', authenticate(), authorizePostOwner, multerHandleError(upload.single('image')), uploadImage)
router.post('/', authenticate(), postValidator, createPost)
router.put('/:id', authenticate(), authorizePostOwner, postValidator, updatePost)
router.delete('/:id', authenticate(), authorizePostOwner, deletePost)

// Comment - All role
router.get('/:id/comments', getCommentByPost)
router.post('/:id/comments', authenticate(), commentValidator, createComment)

module.exports = router