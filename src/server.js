const dotenv = require('dotenv')
dotenv.config()

const app = require('./app.js')
const connectMongoDb = require('./config/database.js')

const PORT = process.env.PORT || 9000

connectMongoDb()

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))