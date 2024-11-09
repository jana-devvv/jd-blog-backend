const Comment = require('../model/Comment.js')
const Post = require('../model/Post.js')
const Profile = require('../model/Profile.js')
const { errorResponse } = require('../utils/response.js')

const authorizePostOwner = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 404, "Post not found");

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return errorResponse(res, 403, "Access forbidden")
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, "Server Error", error.message)
  }
};

const authorizeCommentOwner = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) return errorResponse(res, 404, "Comment not found")

    if (comment.author.toString() !== req.user.id && req.user.role !== "admin" ) {
      return errorResponse(res, 403, "Access forbidden")
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, "Server Error", error.message)
  }
};

const authorizeProfileOwner = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });
    
    if (!profile) return errorResponse(res, 404, "Profile not found")

    if (profile.user.toString() !== req.user.id && req.user.role !== "admin") {
      return errorResponse(res, 403, "Access forbidden")
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, "Server Error", error.message)
  }
};

module.exports = { authorizePostOwner, authorizeCommentOwner, authorizeProfileOwner}