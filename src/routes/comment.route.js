import { Router } from 'express'
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from '../controllers/comments.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewire.js'


const router = Router()

router.use(verifyJWT)

router.route('/:videoId').get(getVideoComments).post(addComment)
router.route('/c/:commentId').delete(deleteComment).patch(updateComment)

export default router