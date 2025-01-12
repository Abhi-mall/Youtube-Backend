import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comment = await Comment.find({
        video: mongoose.Types.ObjectId(videoId)
    })
    .sort({createdAt: -1})
    .skip((page -1) * limit)
    .limit(limit)

    const totalComments = await Comment.countDocuments(
        {
            video: new mongoose.Types.ObjectId(videoId),
        }
    )

    if(!comment) {
        throw new ApiError(400, "No comment found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                comment,
                totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: page,
            },
            'Comments fetched successfully'
        ))


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
    const user = req.user

    if(!content) {
        throw new ApiError(400, "Comment id required")
    }
    
    if (!videoId) {
        throw new ApiError(400, 'Video ID is required')
    }

    const comment = Comment.create({
        content,
        vedio: videoId,
        owner: user._id,
    })

    if (!comment) {
        throw new ApiError(500, 'Failed to add comment')
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, {comment}, "comment created successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const user = req.user

    if(!content) {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.findById(commentId)

    if(!comment) {
        throw new ApiError(400, "Comment not found")
    }

    if(comment.owner.toString() != user._id.toString()) {
        throw new ApiError(403, "You are not allowed to change in comment")
    }

    comment.content = content
    await comment.save()

    return res
    .status(200)
    .json(new ApiResponse(200, { comment }, 'Comment updated successfully'))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params
    const user = req.user

    if (!commentId) {
        throw new ApiError(400, 'Comment ID is required')
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, 'Comment not found')
    }

    if (comment.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not allowed to delete this comment')
    }

    await Comment.findOneAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Comment deleted successfully'))


})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }