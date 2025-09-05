import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';
const router = Router();
router.get('/', auth, requireRole('admin'), async (_req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ users });
});
export default router;
