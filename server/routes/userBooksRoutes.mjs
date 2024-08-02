import { Router } from 'express';
import { likeBook, unlikeBook, getLikedBooks } from '../controllers/userBooksController.mjs';
import authenticate from '../middleware/authenticate.mjs';

const router = Router();

router.post('/like', authenticate, likeBook);
router.post('/unlike', authenticate, unlikeBook);
router.get('/liked', authenticate, getLikedBooks);

export default router;