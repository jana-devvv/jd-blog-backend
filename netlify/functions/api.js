const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const serverless = require('serverless-http')

const authRoutes = require('../../src/routes/authRoutes.js')
const postRoutes = require('../../src/routes/postRoutes.js')
const categoryRoutes = require('../../src/routes/categoryRoutes.js')
const commentRoutes = require('../../src/routes/commentRoutes.js')
const userRoutes = require('../../src/routes/userRoutes.js')
const connectMongoDb = require('../../src/config/database.js')

// Application
const app = express();

// Connect database
connectMongoDb()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/public", express.static("public"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);

export const handler = serverless(app)