import { Router } from 'express';
import { generateVideo, getVideos, getVideoStatus } from '../controllers/videoController';

const router = Router();

// TODO: 添加 authMiddleware 进行路由保护

router.post('/generate', generateVideo);
router.get('/', getVideos);
router.get('/:id', getVideoStatus);

export default router;

