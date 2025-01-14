import { Router } from 'express'
import {
    getAllVideos,
    getVideoById,
    publishAVideo,
    deleteVideo,
    updateVideo,
    togglePublishStatus,
} from '../controllers/videos.controller.js'
import { upload } from '../middlewares/multer.middlewire.js'
import { verifyJWT } from '../middlewares/auth.middlewire.js'

const router = Router()

router
    .route('/')
    .get(getAllVideos)
    .post(
        verifyJWT,
        upload.fields([
            {
                name: 'videoFile',
                maxCount: 1,
            },
            {
                name: 'thumbnail',
                maxCount: 1,
            },
        ]),
        publishAVideo
    )

router
    .route('/:videoId')
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(upload.single('thumbnail'), updateVideo)

router.route('/toggle/publish/:videoId').patch(verifyJWT, togglePublishStatus)

export default router