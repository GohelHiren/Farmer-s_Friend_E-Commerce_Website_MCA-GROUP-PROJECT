import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Cart() {
  const [cart, setCart] = useState(null)

  async function load() {
    try {
      const data = await api('/cart', { auth: true })
      setCart(data.cart || { items: [] })
    } catch (err) {
      console.error("Failed to load cart:", err)
      setCart({ items: [] })
    }
  }

  async function removeItem(productId) {
    try {
      await api(`/cart/items/${productId}`, { method: 'DELETE', auth: true })
      window.dispatchEvent(new Event('cart-updated'))
      await load()
    } catch (err) {
      console.error("Failed to remove item:", err)
    }
  }

  async function checkout() {
    try {
      await api('/cart/checkout', { method: 'POST', auth: true })
      alert("Order placed successfully!")
      window.dispatchEvent(new Event('cart-updated'))
      await load()
    } catch (err) {
      console.error("Checkout failed:", err)
      alert("Checkout failed")
    }
  }

  useEffect(() => { load() }, [])

  if (!cart) return <div className="p-4">Loading...</div>
  const items = cart.items || []

  // Totals
  const subtotal = items.reduce(
    (sum, i) => sum + (i.productId?.price || 0) * (i.qty || 0), 0
  )
  const gst = subtotal * 0.05 // demo GST 5%
  const total = subtotal + gst

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Items */}
      <div className="lg:col-span-2 card">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 && <p>Your cart is empty.</p>}
        <div className="space-y-4">
          {items.map(i => (
            <div key={i._id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={i.productId?.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={i.productId?.title || "Product"}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div>
                  <div className="font-semibold">{i.productId?.title || "Unnamed product"}</div>
                  <div className="text-sm text-gray-600">
                    ₹{i.productId?.price || 0} × {i.qty}
                  </div>
                </div>
              </div>
              <button
                className="text-red-600 hover:underline"
                onClick={() => removeItem(i.productId._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Billing */}
      <div className="card h-fit">
        <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="btn btn-primary w-full mt-6"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
