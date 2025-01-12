import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if( !name || name.trim() == "" ) {
        throw new ApiError( 400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user._id,
    })
    
    if(!playlist) {
        throw new ApiError(500, "failed to create playlist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, {playlist}, "playlist created successfully")
    )
})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const userPlaylists = await Playlist.find({ owner: userId })

    if(!userPlaylists) {
        throw new ApiError(404, "Playlists not found for this user");
    }

    return res.status(200).json(new ApiResponse(200, {userPlaylists}, "user playlist feteched successfully"))
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist id')
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist },
                'Playlist retrieved successfully'
            )
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video id')
    }

    const playlist = await Playlist.findById([playlistId])

    if(!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    const videoExists = playlist.videos.includes(videoId)

    if(!videoExists) {
        throw new ApiError(400, "Video already exits in playlist");
    }

    await playlist.video.push(videoId)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {playlist}, "video added in playlist successfully")
    )
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video id')
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    if(playlist.videos.length === 0 ) {
        throw new ApiError(400, "No videos in the plyalist")
    }

    if(!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in playlist")
    }

    const videoIndex = playlist.videos.indexOf(videoId)
    playlist.videos.splice(videoIndex, 1)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {playlist}, "Video deleted successfully from playlist")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist");
    }

    const deletedplaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedplaylist) {
        throw new ApiError(500, "Deletion failed");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    if (name) {
        playlist.name = name
    }
    if (description) {
        playlist.description = description
    }

    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, { playlist }, 'Playlist updated successfully')
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}