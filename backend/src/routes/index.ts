import { Router } from 'express';
import brandKitRoutes from './brandKits';
import videoRoutes from './videos';

const router = Router();

// Mount modules
router.use('/brand-kits', brandKitRoutes);
router.use('/videos', videoRoutes);

export default router;
