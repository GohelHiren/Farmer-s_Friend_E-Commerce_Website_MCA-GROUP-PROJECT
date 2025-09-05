import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const stats = async (_req, res) => {
  const [products, orders, users] = await Promise.all([
    Product.countDocuments(), Order.countDocuments(), User.countDocuments()
  ]);

  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  const since = new Date(Date.now() - 30*24*60*60*1000);
  const ordersByDateAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
    { $sort: { _id: 1 } }
  ]);

  const salesByCategoryAgg = await Order.aggregate([
    { $unwind: "$items" },
    { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "p" } },
    { $unwind: "$p" },
    { $group: { _id: "$p.type", total: { $sum: { $multiply: ["$items.qty", "$items.price"] } } } },
    { $sort: { total: -1 } }
  ]);

  res.json({
    products, orders, users, revenue,
    ordersByDate: ordersByDateAgg,
    salesByCategory: salesByCategoryAgg
  });
};

export const listUsers = async (_req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ users });
};
