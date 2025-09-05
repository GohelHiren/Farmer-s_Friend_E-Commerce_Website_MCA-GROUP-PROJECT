import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
  res.json({ cart });
};

export const upsertItem = async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx >= 0) cart.items[idx].qty = qty;
  else cart.items.push({ productId, qty });
  await cart.save();
  res.json({ cart });
};

export const removeItem = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.productId.toString() != productId);
  await cart.save();
  res.json({ cart });
};
