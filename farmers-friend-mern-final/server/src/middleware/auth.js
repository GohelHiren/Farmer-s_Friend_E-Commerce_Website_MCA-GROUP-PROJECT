import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user // <-- REQUIRED
    next()
  } catch (e) {
    console.error('Auth error:', e)
    res.status(401).json({ error: 'Unauthorized' })
  }
}

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};
