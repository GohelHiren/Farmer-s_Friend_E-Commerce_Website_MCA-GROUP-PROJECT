import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const placeOrder = async (req, res) => {
  const { address } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
  const items = cart.items.map(i => ({ productId: i.productId._id, qty: i.qty, price: i.productId.price }));
  const amount = items.reduce((s,i) => s + i.qty * i.price, 0);
  const order = await Order.create({ userId: req.user.id, items, amount, address, status: 'pending' });
  cart.items = [];
  await cart.save();
  res.status(201).json({ order });
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
};

export const allOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json({ orders });
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json({ order });
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json({ order });
};
