const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User.js')
const { errorResponse, successResponse } = require('../utils/response.js')
const { validationResult } = require('express-validator')
const Profile = require('../model/Profile.js')

const register = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

    try {
        const { username, email, password } = req.body

        const user = await User.findOne({ email })

        if(user) return errorResponse(res, 500, "Email already use")

        const createUser = await User.create({ username, email, password })
        await Profile.create({ user: createUser._id })

        const newUser = await User.findById(createUser._id).select("-password")

        successResponse(res, 201, "User created successfully", newUser)
    } catch (error) {
        errorResponse(res, 500, "Error creating user", error.message)
    }
}

const login = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if(!user) return errorResponse(res, 404, "User not found")
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return errorResponse(res, 400, "Invalid credentials")

        const token = jwt.sign({ 
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
         }, process.env.JWT_ACCESS_KEY, { expiresIn: "1h" })

        res.cookie('accessToken', token)
        
        successResponse(res, 200, "Login successfully")
    } catch (error) {
        errorResponse(res, 500, "Error logging in", error.message)
    }
}

const logout = async (req, res) => {
    res.clearCookie('accessToken')

    successResponse(res, 200, "Logged out successfully")
}

module.exports = { register, login, logout }