const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/response.js')

const authenticate = (role = null) => (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) return errorResponse(res, 401, "No token, authorization denied")

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    req.user = user

    if(role && (user.role !== role || role !== "admin")) {
      return errorResponse(res, 403, "Access forbidden")
    }
    
    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid Token")
  }
};

module.exports = authenticate