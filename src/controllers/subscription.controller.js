import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId) {
        throw new ApiError(400, "Channel is required")
    }

    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    if(isSubscribed) {
        await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId,
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Unsuscribed successfully")
        )
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Subscribed successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!channelId) throw new ApiError(400, 'Channel ID is required')

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: 'user',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscribers',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullnmae: 1,
                            email: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $arrayElemAt: ['$subscribers', 0]
                },
            }
        },
        {
            $project: {
                subscriber: 1,
                _id: 0,
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            'Subscribers fetched successfully'
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId))
        throw new ApiError(400, 'Subscriber ID is required')

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'channel',
                foreignField: '_id',
                as: 'channels',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                channel: '$channels',
            },
        },
        {
            $project: {
                channels: 1,
            },
        },
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { channels },
                'Subscribed channels fetched successfully'
            )
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}