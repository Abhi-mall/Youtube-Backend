import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content || content.trim() === "") {
        throw new ApiError(400, "content is required")
    }

    const tweet = Tweet.create({
        content,
        owner: req.user._id
    }) 

    if(!tweet) {
        throw new ApiError(400, "tweet not created ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "tweet created successfully")
    )
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params

    if( userId && !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user")
    }

    const tweets = Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",

                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullname: 1
                        }
                    }
                ]

            }
        },
        {
            $addFields: {
                owner: { $arrElemAt: ["$owner", 0]}
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, tweets, 'User tweets'))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const user = await User.findById(req.user._id)
    const tweet = await Tweet.findById(req.params.tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== user._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }

    tweet.content = req.body.content
    await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const user = await User.findById(req.user._id)
    const tweet = await Tweet.findById(req.params.tweetId)

    if(tweet.owner.toString() !== user._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }

    await Tweet.findByIdAndDelete(req.params.tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}