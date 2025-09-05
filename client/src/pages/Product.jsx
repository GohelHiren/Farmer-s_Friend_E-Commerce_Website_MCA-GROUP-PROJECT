import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, currentUser } from '../lib/api'

export default function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const navigate = useNavigate()
  const user = currentUser()

  useEffect(() => {
    (async () => {
      const data = await api(`/products/${id}`)
      setProduct(data.product)
    })()
  }, [id])

  async function addToCart() {
    if (!user) return navigate('/login')
    await api('/cart/items', { method: 'POST', auth: true, body: { productId: id, qty } })
    window.dispatchEvent(new Event('cart-updated'))
    alert('Added to cart!')
  }

  if (!product) return <div className="p-4">Loading...</div>

  return (
    <div className="card p-6 grid md:grid-cols-2 gap-6">
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=Product'}
        alt={product.title}
        className="w-full h-80 object-contain rounded-xl bg-gray-50"
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-lg font-bold text-green-700 mb-4">
          ₹{product.price} <span className="text-sm text-gray-600">/ {product.unit}</span>
        </p>
        <div className="flex items-center gap-3 mb-4">
          <label>Qty:</label>
          <input
            type="number"
            value={qty}
            min="1"
            onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded px-3 py-1 w-20"
          />
        </div>
        <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
        <Link to="/market" className="ml-4 text-blue-600 hover:underline">← Back to Market</Link>
      </div>
    </div>
  )
}
