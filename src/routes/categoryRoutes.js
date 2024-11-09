const express = require('express')
const categoryValidator = require('../validators/categoryValidator.js')
const authenticate = require('../middleware/auth.js')
const { createCategory, deleteCategory, getAllCategories, updateCategory } = require('../controllers/categoryController.js')

const router = express.Router()

// All Role
router.get('/', getAllCategories)

// Admin
router.post('/', authenticate('admin'), categoryValidator, createCategory)
router.put('/:id', authenticate('admin'), categoryValidator, updateCategory)
router.delete('/:id', authenticate('admin'), deleteCategory)

module.exports = router