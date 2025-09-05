// server/src/routes/cart.js
import express from 'express'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { auth } from '../middleware/auth.js'
import Razorpay from 'razorpay'

const router = express.Router()

// check if real keys exist
const HAS_RZ_KEYS = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
const rz = HAS_RZ_KEYS
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null

// Get cart
router.get('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
  res.json({ cart })
})

// Add to cart
router.post('/items', auth, async (req, res) => {
  const { productId, qty } = req.body
  if (!productId || !qty) return res.status(400).json({ error: 'Product ID and qty required' })

  let cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) cart = new Cart({ userId: req.user._id, items: [] })

  const existing = cart.items.find(i => i.productId.toString() === productId)
  if (existing) existing.qty += qty
  else cart.items.push({ productId, qty })

  await cart.save()
  await cart.populate('items.productId')
  res.json({ ok: true, cart })
})

// Remove item
router.delete('/items/:productId', auth, async (req, res) => {
  const { productId } = req.params
  let cart = await Cart.findOne({ userId: req.user._id })
  if (!cart) return res.status(404).json({ error: 'Cart not found' })

  cart.items = cart.items.filter(i => i.productId.toString() !== productId)
  await cart.save()
  await cart.populate('items.productId')
  res.json({ ok: true, cart })
})

// Checkout
router.post('/checkout', auth, async (req, res) => {
  const { paymentMethod = 'cod', address } = req.body || {}
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }

  // stock check
  for (const i of cart.items) {
    if ((i.productId.stockQty ?? 0) < i.qty) {
      return res.status(400).json({ error: `Not enough stock for ${i.productId.title}` })
    }
  }

  const items = cart.items.map(i => ({
    productId: i.productId._id,
    qty: i.qty,
    price: i.productId.price
  }))
  const amount = items.reduce((s, i) => s + i.qty * i.price, 0)

  if (paymentMethod === 'cod') {
    // decrement stock
    for (const i of cart.items) {
      await Product.findByIdAndUpdate(i.productId._id, { $inc: { stockQty: -i.qty } })
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      amount,
      address,
      paymentInfo: { provider: 'cod' },
      status: 'pending'
    })

    cart.items = []
    await cart.save()

    return res.json({ ok: true, order })
  }

  // Online (Razorpay or fake)
  const order = await Order.create({
    userId: req.user._id,
    items,
    amount,
    address,
    paymentInfo: { provider: 'razorpay' },
    status: 'payment_pending'
  })

  if (!HAS_RZ_KEYS) {
    console.warn('⚠️ Razorpay keys missing: using mock order')
    return res.json({
      ok: true,
      order,
      razorpay: { orderId: 'order_mock123', amount: amount * 100, currency: 'INR' }
    })
  }

  const rpOrder = await rz.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: order._id.toString()
  })
  order.paymentInfo.razorpay = { orderId: rpOrder.id }
  await order.save()

  res.json({ ok: true, order, razorpay: rpOrder })
})

export default router
