const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes.js')
const postRoutes = require('./routes/postRoutes.js')
const categoryRoutes = require('./routes/categoryRoutes.js')
const commentRoutes = require('./routes/commentRoutes.js')
const userRoutes = require('./routes/userRoutes.js')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/public", express.static("public"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app