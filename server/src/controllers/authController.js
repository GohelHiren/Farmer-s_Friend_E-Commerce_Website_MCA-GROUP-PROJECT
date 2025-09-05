import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const sign = (user) => jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const token = sign(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = sign(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};
