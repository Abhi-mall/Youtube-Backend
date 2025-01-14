import { Router } from 'express'
import {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers,
} from '../controllers/subscriptions.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewire.js'

const router = Router()

router.use(verifyJWT)

router
    .route('/c/:channelId')
    .get(getUserChannelSubscribers)
    .post(toggleSubscription)

router.route('/u/:subscriberId').get(getSubscribedChannels)

export default router