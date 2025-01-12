import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "video not found");
    }

    const like =  await Like.findOne({video: videoId})

    if(like) {
        if(like.likedBy.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are authorized to remove this like")
        }

        await Like.findByIdAndDelete(like._id)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, 'Like removed successfully'))
    }
    else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, {like}, 'Like added successfully'))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    // Check if user has already liked the video
    const comment = await Like.findOne({
        comment: commentId,
    })

    // If user has already liked the video, remove the like
    if (comment) {
        if (comment.likedBy.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                'You are not authorized to remove this like'
            )
        }

        await Like.findByIdAndDelete(comment._id)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, 'Like removed successfully'))
    } else {
        // If user has not liked the video, add the like
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { like }, 'Like added successfully'))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet ID')
    }

    const tweet = await Like.findOne({
        tweet: tweetId,
    })

    if (tweet) {
        if (tweet.likedBy.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                'You are not authorized to remove this like'
            )
        }

        await Like.findByIdAndDelete(tweet._id)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, 'Like removed successfully'))
    } else {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { like }, 'Like added successfully'))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideo = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
           $lookup: {
            from: "videos",
            localField: "video",
            foregnField: "_id",
            as: "video",
           },
        },
        {
            $addFields: {
                video: '$video',
            }
        },
        {
            $project: {
                _id: 1,
                video: 1,
                likedBy: 1,
            },
        }
    ])

    if (!likedVideos) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], 'No liked videos found'))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                'Liked videos fetched successfully'
            )
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}