import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// GET /api/products?q=...&category=<categoryId>
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query
    const filter = {}
    if (q) filter.title = { $regex: q, $options: 'i' }
    if (category) filter.categoryId = category   // <-- IMPORTANT: use your model's field

    const items = await Product.find(filter)
    res.json({ items })
  } catch (err) {
    console.error('GET /products failed:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({ product }) // <-- frontend expects { product }
  } catch (err) {
    console.error('GET /products/:id failed:', err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router