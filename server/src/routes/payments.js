// server/src/routes/payments.js
import express from 'express'
import crypto from 'crypto'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const HAS_RZ_KEYS = process.env.RAZORPAY_KEY_SECRET

router.post('/verify', auth, async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
  const order = await Order.findOne({ _id: orderId, userId: req.user._id })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.status !== 'payment_pending') {
    return res.status(400).json({ error: 'Order not in payment_pending state' })
  }

  if (!HAS_RZ_KEYS) {
    // fake verification
    order.status = 'paid'
    await order.save()
  } else {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')
    if (expected !== razorpay_signature) return res.status(400).json({ error: 'Invalid signature' })
    order.status = 'paid'
    order.paymentInfo.razorpay = { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature }
    await order.save()
  }

  // decrement stock + clear cart
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId')
  if (cart && cart.items.length) {
    for (const i of cart.items) {
      await Product.findByIdAndUpdate(i.productId._id, { $inc: { stockQty: -i.qty } })
    }
    cart.items = []
    await cart.save()
  }

  res.json({ ok: true, order })
})

export default router
