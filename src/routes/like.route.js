
import { Router } from 'express'
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from '../controllers/likes.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewire.js'

const router = Router()
router.use(verifyJWT)

router.route('/toggle/v/:videoId').post(toggleVideoLike)
router.route('/toggle/c/:commentId').post(toggleCommentLike)
router.route('/toggle/t/:tweetId').post(toggleTweetLike)
router.route('/videos').get(getLikedVideos)

export default router