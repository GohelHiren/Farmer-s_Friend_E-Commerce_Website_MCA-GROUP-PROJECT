import express from 'express'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Place new order (used in checkout)
router.post('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" })
  }

  const subtotal = cart.items.reduce(
    (sum, i) => sum + (i.productId?.price || 0) * (i.qty || 0), 0
  )
  const gst = subtotal * 0.05
  const total = subtotal + gst

  const order = new Order({
    userId: req.user._id,
    items: cart.items.map(i => ({
      productId: i.productId._id,
      qty: i.qty,
      price: i.productId.price
    })),
    subtotal,
    gst,
    total,
    status: "Placed"
  })

  await order.save()

  // Clear cart after checkout
  cart.items = []
  await cart.save()

  res.json({ ok: true, order })
})

// Get all orders of logged-in user
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('items.productId')
    .sort({ createdAt: -1 })
  res.json({ orders })
})

export default router
