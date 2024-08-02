import { Router } from 'express'
import { listBook, getListedBooks, getRecommendations, getAllBooks, searchBooks } from '../controllers/bookController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.post('/list', authenticate, listBook)
router.get('/user', authenticate, getListedBooks)
router.get('/recommendations', authenticate, getRecommendations)
router.get('/', authenticate, getAllBooks)
router.get('/search', authenticate, searchBooks)

export default router
