const Comment = require('../model/Comment.js')
const Post = require('../model/Post.js')
const createPagination = require('../utils/pagination.js')
const cloudinary = require('../config/cloudinary.js')
const { errorResponse, successResponse } = require('../utils/response.js')
const { validationResult } = require('express-validator')

const getAllPosts = async (req, res) => {
  const { page, limit, skip } = createPagination(req)

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
    const posts = await Post.find(query).skip(skip).limit(limit).exec()
    const totalPosts = await Post.countDocuments(query)
    const totalPages = Math.ceil(totalPosts / limit)

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Post fetched successfully",
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message)
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 }}, {new: true}).populate('author', 'username').populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username'
      }
    })
    
    if (!post) return errorResponse(res, 404, 'Post not found')

    successResponse(res, 200, "Post retrieved successfully", post)
  } catch (error) {
    errorResponse(res, 500, 'Error fetching post', error.message)
  }
};

const getPostDrafts = async (req, res) => {
  try {
    const userId = req.user.id
    const drafts = await Post.find({ status: 'draft', author: userId })
    successResponse(res, 200, "Post retrieved successfully", drafts)
  } catch (error) {
    errorResponse(res, 500, 'Error fetching post', error.message)
  }
}

const likePostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true })

    if (!post) return errorResponse(res, 404, 'Post not found')
    
    successResponse(res, 200, "Post liked!", { likes: post.likes })
  } catch (error) {
    errorResponse(res, 500, 'Error liking post', error.message)
  }
}

const createPost = async (req, res) => {
  const errors = validationResult(req) 
  if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())
  
  try {
    const userId = req.user.id
    const { title, content, status, categoryId } = req.body;
    const newPost = await Post.create({ title, content, status: status || "draft", author: userId, category: categoryId })

    successResponse(res, 201, "Post created successfully", newPost)
  } catch (error) {
    errorResponse(res, 500, "Error creating post", error.message)
  }
};

const uploadImage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post) return errorResponse(res, 404, "Post not found")

    if(!req.file) return errorResponse(res, 400, "No file uploaded")

    cloudinary.uploader.upload_stream({ folder: "images" }, async (error, result) => {
      if(error) return errorResponse(res, 500, "Failed to upload image", error)
        
      const post = await Post.findByIdAndUpdate(req.params.id, { $set: { image: result.secure_url }}, { new: true })
        
      successResponse(res, 200, "Post image uploaded successfully", { image: post.image })
    }).end(req.file.buffer)
    
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message)
  }
}

const updatePost = async (req, res) => {
  const errors = validationResult(req) 
  if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

  try {
    const { title, content, categoryId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content, category: categoryId }, { new: true });

    if (!updatedPost) return errorResponse(res, 404, "Post not found")

    successResponse(res, 200, "Post updated successfully", updatedPost)
  } catch (error) {
    errorResponse(res, 500, "Error updating post", error.message)
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    await Comment.deleteMany({ post: deletedPost._id })

    if (!deletedPost) return errorResponse(res, 404, "Post not found")

    successResponse(res, 200, "Post deleted successfully", deletedPost)
  } catch (error) {
    errorResponse(res, 500, "Error deleting post", error.message)
  }
};

module.exports = { getAllPosts, getPostById, getPostDrafts, likePostById, createPost, uploadImage, updatePost, deletePost }