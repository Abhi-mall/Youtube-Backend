import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middlewire.js'
import {
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserPlaylists,
} from '../controllers/playlists.controller.js'

const router = Router()

router.use(verifyJWT)

router.route('/').post(createPlaylist)

router
    .route('/:playlistId')
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist)

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist)
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist)

router.route('/user/:userId').get(getUserPlaylists)

export default router