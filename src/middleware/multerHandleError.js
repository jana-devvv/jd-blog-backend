const multer = require('multer');
const { errorResponse } = require('../utils/response');

const multerHandleError = (upload) => (req, res, next) => {
    upload(req, res, function(err) {
        if(err instanceof multer.MulterError) {
            return errorResponse(res, 400, `Multer Error: ${err.message}`)
        } else if (err) {
            return errorResponse(res, 400, "File upload failed", err.message);
        }

        next()
    })
}

module.exports = multerHandleError