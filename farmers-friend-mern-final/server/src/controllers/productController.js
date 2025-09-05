import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  const { q, category, sort = 'createdAt:desc' } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.categoryId = category;
  let query = Product.find(filter);
  const [field, dir] = sort.split(':');
  query = query.sort({ [field]: dir === 'asc' ? 1 : -1 });
  const items = await query.limit(200);
  res.json({ items });
};

export const getProduct = async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ item: product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ item: product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
};
