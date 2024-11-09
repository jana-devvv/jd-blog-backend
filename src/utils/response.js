const successResponse = (res, code, message, data = null) => {
    res.status(code).json({
        code,
        status: "Success",
        message,
        data
    })
}

const errorResponse = (res, code, message, errors = null) => {
    res.status(code).json({
        code,
        status: "Error",
        message,
        errors
    })
}

module.exports = { successResponse, errorResponse }