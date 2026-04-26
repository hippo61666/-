import { Router } from 'express';
import { 
  getBrandKits, 
  createBrandKit, 
  getBrandKitById, 
  updateBrandKit, 
  deleteBrandKit 
} from '../controllers/brandKitController';

const router = Router();

// TODO: 添加 authMiddleware 进行路由保护 (例如 router.use(authMiddleware))

router.get('/', getBrandKits);
router.post('/', createBrandKit);
router.get('/:id', getBrandKitById);
router.put('/:id', updateBrandKit);
router.delete('/:id', deleteBrandKit);

export default router;

