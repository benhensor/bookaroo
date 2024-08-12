import { Router } from 'express'
import { getUsersMessages, getAllMessages, sendMessage, markMessageAsRead, markMessageAsUnread, deleteMessage } from '../controllers/messagesController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.get('/inbox', authenticate, getUsersMessages)
router.get('/all', authenticate, getAllMessages)
router.post('/send', authenticate, sendMessage)
router.put('/mark/:id', authenticate, markMessageAsRead)
router.put('/unread/:id', authenticate, markMessageAsUnread)
router.delete('/delete/:id', authenticate, deleteMessage)

export default router