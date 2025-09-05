import { useEffect, useState } from 'react'
import { api, currentUser } from '../lib/api'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Market() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialSlug = new URLSearchParams(location.search).get('category') || ''

  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [cats, setCats] = useState([])
  const [catId, setCatId] = useState('')    // _id to send to API
  const [slug, setSlug] = useState(initialSlug)
  const [loading, setLoading] = useState(false)

  const user = currentUser()

  // Load categories, then resolve slug -> _id
  useEffect(() => {
    (async () => {
      const data = await api('/categories')
      const list = data.items || []
      setCats(list)
      if (initialSlug) {
        const match = list.find(c => c.slug === initialSlug)
        if (match) {
          setSlug(match.slug)
          setCatId(match._id)
        }
      }
    })()
  }, [initialSlug])

  // Load products when filters change
  async function loadProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (catId) params.set('category', catId) // backend expects categoryId/_id
      const data = await api(`/products?${params.toString()}`)
      setItems(data.items || [])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { loadProducts() }, [q, catId])

  async function addToCart(productId) {
    if (!user) return navigate('/login')
    try {
      await api('/cart/items', { method: 'POST', auth: true, body: { productId, qty: 1 } })
      window.dispatchEvent(new Event('cart-updated'))
      alert('Added to cart!')
    } catch (e) {
      console.error('addToCart failed:', e)
      alert(e.message || 'Failed to add to cart')
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3">Market</h2>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="input"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search products... (urea, npk, cumin)"
        />
        <select
          className="select"
          value={slug}
          onChange={e => {
            const s = e.target.value
            setSlug(s)
            const found = cats.find(c => c.slug === s)
            setCatId(found ? found._id : '')
          }}
        >
          <option value="">All Categories</option>
          {cats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={loadProducts}>Apply</button>
      </div>

      {loading ? (
        <div className="mt-6 text-gray-600">Loading…</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {items.map(p => (
            <div key={p._id} className="card hover:shadow-lg transition flex flex-col">
              <Link to={`/product/${p._id}`}>
                <img
                  src={p.images?.[0] || 'https://via.placeholder.com/300x180?text=Product'}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="mt-2">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">
                    {p.brand ? `${p.brand} • ` : ''}{p.subType || p.type}
                  </div>
                  <div className="mt-1 font-bold">
                    ₹{p.price} <span className="text-sm text-gray-600">/ {p.unit}</span>
                  </div>
                </div>
              </Link>
              <button onClick={() => addToCart(p._id)} className="mt-3 btn btn-primary">
                Add to Cart
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-gray-500 col-span-full">No products found.</p>}
        </div>
      )}
    </div>
  )
}
