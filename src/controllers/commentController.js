const Comment = require('../model/Comment.js')
const Post = require('../model/Post.js')
const createPagination = require('../utils/pagination.js')
const { errorResponse, successResponse } = require('../utils/response.js')
const { validationResult } = require('express-validator')

const createComment = async (req, res) => {
  const errors = validationResult(req) 
  if(!errors.isEmpty()) return errorResponse(res, 400, "Validation failed", errors.array())

  try {
    const post = await Post.findById(req.params.id)
    if(!post) return errorResponse(res, 404, "Post not found")

    const { content } = req.body;
    const userId = req.user.id
    const newComment = await Comment.create({ content, author: userId, post: post._id })

    await Post.findByIdAndUpdate(post._id, { $push: { comments: newComment._id } }, {new: true, useFindAndModify: false})

    successResponse(res, 201, "Comment added successfully", newComment)
  } catch (error) {
    errorResponse(res, 500, 'Error creating comment', error.message)
  }
};

const getCommentByPost = async (req, res) => {
  const { page, limit, skip } = createPagination(req)

  try {
    const comments = await Comment.find({ post: req.params.id }).skip(skip).limit(limit).populate({ path: "author", select: "username avatar" }).exec();
    const totalComments = await Comment.countDocuments({ post: req.params.id });
    const totalPages = Math.ceil(totalComments / limit);

    res.status(200).json({
      code: 200,
      status: 'Success',
      message: 'Comments fetched successfully',
      data: comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        limit,
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Server Error', error.message)
  }
};

const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) return errorResponse(res, 404, "Comment not found")

    await Post.updateOne({ _id: deletedComment.post }, { $pull: { comments: req.params.id } })

    successResponse(res, 200, "Comment deleted successfully", deletedComment)
  } catch (error) {
    errorResponse(res, 500, 'Error deleting comment', error.message)
  }
};

module.exports = { createComment, getCommentByPost, deleteComment }