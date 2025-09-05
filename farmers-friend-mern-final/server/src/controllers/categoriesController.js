import Category from '../models/Category.js';

export const listCategories = async (_req, res) => {
  const items = await Category.find({}).sort({ name: 1 });
  res.json({ items });
};
