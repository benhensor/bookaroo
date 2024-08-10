import { Router } from 'express'
import { getAllMessages, sendMessage, markMessageAsRead, markMessageAsUnread, deleteMessage } from '../controllers/messagesController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.get('/inbox', authenticate, getAllMessages)
router.post('/send', authenticate, sendMessage)
router.put('/mark/:id', authenticate, markMessageAsRead)
router.put('/unread/:id', authenticate, markMessageAsUnread)
router.delete('/delete/:id', authenticate, deleteMessage)

export default router