import { Router } from 'express';
import brandKitRoutes from './brandKits';

const router = Router();

// Mount modules
router.use('/brand-kits', brandKitRoutes);

export default router;
