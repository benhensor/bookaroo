import { Router } from 'express'
import { createBook, getBooks } from '../controllers/bookController.mjs'
import authenticate from '../middleware/authenticate.mjs'

const router = Router()

router.post('/list', authenticate, createBook)
router.get('/', getBooks)

export default router
