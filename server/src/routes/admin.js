import { Router } from 'express';
import { stats, listUsers } from '../controllers/adminController.js';
import { auth, requireRole } from '../middleware/auth.js';
const router = Router();
router.get('/stats', auth, requireRole('admin'), stats);
router.get('/users', auth, requireRole('admin'), listUsers);
export default router;
