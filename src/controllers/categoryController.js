const Category = require('../model/Category.js')
const { errorResponse, successResponse } = require('../utils/response.js')
const { validationResult } = require('express-validator')

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({})

        successResponse(res, 200, "Category fetched successfully", categories)
    } catch (error) {
        errorResponse(res, 500, 'Server Error', error.message)
    }
}

const createCategory = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

    try {
        const { name } = req.body
        const newCategory = await Category.create({ name })
        successResponse(res, 201, "Category created successfully", newCategory)
    } catch (error) {
        errorResponse(res, 500, 'Server Error', error.message)
    }
}

const updateCategory = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

    try {
        const { name } = req.body

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true })

        if (!updatedCategory) return errorResponse(res, 404, "Category not found")

        successResponse(res, 200, "Category updated successfully", updatedCategory)
    } catch (error) {
        errorResponse(res, 500, 'Server Error', error.message)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id)

        if (!deletedCategory) return errorResponse(res, 404, "Category not found")

        successResponse(res, 200, "Category deleted successfuly", deletedCategory)
    } catch (error) {
        errorResponse(res, 500, 'Server Error', error.message)
    }
}

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory }