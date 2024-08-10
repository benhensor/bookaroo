import { Router } from 'express'
import { listBook, getListedBooks, getRecommendations, deleteListing, getAllBooks, searchBooks } from '../controllers/bookController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.post('/list', authenticate, listBook)
router.delete('/delete/:bookId', authenticate, deleteListing)
router.get('/user', authenticate, getListedBooks)
router.get('/recommendations', authenticate, getRecommendations)
router.get('/', authenticate, getAllBooks)
router.get('/search', authenticate, searchBooks)

export default router