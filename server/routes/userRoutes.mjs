import { Router } from 'express'
import {
	getUserDetails,
	updateUserDetails,
	updatePreferences,
} from '../controllers/userController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.get('/current', authenticate, getUserDetails)
router.put('/update', authenticate, updateUserDetails)
router.put('/preferences', authenticate, updatePreferences)

export default router