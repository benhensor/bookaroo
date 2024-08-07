import { Router } from 'express'
import {
	getUserDetails,
	searchUsers,
	updateUserDetails,
	likeBook,
	unlikeBook,
	getLikedBooks,
	updatePreferences,
} from '../controllers/userController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.get('/current', authenticate, getUserDetails)
router.get('/search', authenticate, searchUsers)
router.put('/update', authenticate, updateUserDetails)
router.put('/like', authenticate, likeBook)
router.put('/unlike', authenticate, unlikeBook)
router.get('/liked', authenticate, getLikedBooks)
router.put('/preferences', authenticate, updatePreferences)

export default router