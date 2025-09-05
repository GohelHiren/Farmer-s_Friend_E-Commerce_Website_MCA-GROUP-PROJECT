import { Link, useNavigate, useLocation } from 'react-router-dom'
import { currentUser, clearAuth, api } from '../lib/api'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const user = currentUser()
  const nav = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  async function refreshCartCount() {
    if (!user) { setCartCount(0); return }
    try {
      const data = await api('/cart', { auth: true })
      const count = (data.cart?.items || []).reduce((s, i) => s + (i.qty || 0), 0)
      setCartCount(count)
    } catch {
      setCartCount(0)
    }
  }

  useEffect(() => { refreshCartCount() }, [location.pathname])
  useEffect(() => {
    const handler = () => refreshCartCount()
    window.addEventListener('cart-updated', handler)
    return () => window.removeEventListener('cart-updated', handler)
  }, [])

  return (
    <header className="bg-green-700 text-white rounded-2xl shadow px-6 py-3 mt-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-green-200">🌾 Farmer&apos;s Friend</Link>
        <nav className="flex items-center gap-6 font-medium">
          <Link to="/market" className="hover:text-green-200">Market</Link>
          <Link to="/cart" className="relative hover:text-green-200">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 text-xs px-2 py-0.5 rounded-full bg-white text-green-700 font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {user && <Link to="/orders" className="hover:text-green-200">Orders</Link>}
          {!user && <Link to="/login" className="hover:text-green-200">Login</Link>}
          {!user && <Link to="/register" className="hover:text-green-200">Register</Link>}
          {user?.role === 'admin' && <Link className="hover:text-green-200" to="/admin">Admin</Link>}
          {user && (
            <button
              className="ml-4 bg-white text-green-700 px-4 py-1 rounded-xl hover:bg-green-100"
              onClick={() => { clearAuth(); setCartCount(0); nav('/'); }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
