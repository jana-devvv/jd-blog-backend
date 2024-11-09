const Profile = require('../model/Profile.js')
const User = require('../model/User.js')
const cloudinary = require('../config/cloudinary.js')
const createPagination = require('../utils/pagination.js')
const { errorResponse, successResponse } = require('../utils/response.js')
const { validationResult } = require('express-validator')

const getAllUsers = async (req,res) => {
    const { page, skip, limit } = createPagination(req)

    let query = {}
    if(req.query.search) {
        query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
        ]
        }
    }

    try {
        const users = await User.find(query).select("-password").skip(skip).limit(limit).exec()
        const totalUsers = await User.countDocuments(query)
        const totalPages = Math.ceil(totalUsers / limit)

        res.status(200).json({
            code: 200,
            status: "Success",
            message: "User fetched successfully",
            data: users,
            pagination: {
              currentPage: page,
              totalPages,
              totalUsers,
              limit
            }
        })
    } catch (error) {
        errorResponse(res, 500, "Server Error", error.message)
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

    try {
        const { username, email, password, role } = req.body

        const newUser = await User.create({ username, email, password, role})
        await Profile.create({ user: newUser._id })
        const user = await User.findById(newUser._id).select("-password")

        successResponse(res, 201, "User created successfully", user)
    } catch (error) {
        errorResponse(res, 500, "Error creating user", error.message)
    }
}

const uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user) return errorResponse(res, 404, "User not found")

        if(!req.file) return errorResponse(res, 400, "No file uploaded")
        
        cloudinary.uploader.upload_stream({ folder: "avatars" }, async (error, result) => {
            if(error) return errorResponse(res, 500, "Failed to upload image", error)
                
            const profile = await Profile.findOneAndUpdate({ user: user._id }, { avatar: result.secure_url }, { new: true, upsert: true })

            successResponse(res, 200, "Profile avatar uploaded successfully", { avatar: profile.avatar })
        }).end(req.file.buffer)
        
    } catch (error) {
        errorResponse(res, 500, "Server Error", error.message)
    }
}

module.exports = { getAllUsers, createUser, uploadAvatar }