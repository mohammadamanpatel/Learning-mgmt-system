import { Router } from 'express';
import askAiController from '../controllers/askAiController.js';
import syncEmbeddingsController from '../controllers/syncEmbeddingsController.js';
import { isLoggedIn, isAdmin } from '../middleWares/userMiddleWare.js';

const router = Router();

router.post('/ask-ai', askAiController);
router.post('/sync-embeddings', isLoggedIn, isAdmin, syncEmbeddingsController);

export default router;
