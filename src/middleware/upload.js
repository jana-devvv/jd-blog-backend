const multer = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const upload = multer({ storage, limits: {fileSize: 1024 * 1024 * 5} })

module.exports = upload