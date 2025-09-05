// client/src/pages/Orders.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api('/orders', { auth: true })
      setOrders(Array.isArray(data?.orders) ? data.orders : [])
    } catch (err) {
      // If token expired / not logged in
      if (err?.status === 401) {
        nav('/login')
        return
      }
      setError(err?.message || 'Failed to load orders')
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Safely compute total for an order
  function orderTotal(o) {
    if (typeof o?.amount === 'number') return o.amount
    if (typeof o?.total === 'number') return o.total
    if (Array.isArray(o?.items)) {
      return o.items.reduce(
        (sum, i) =>
          sum +
          (Number(i?.qty) || 0) *
          (Number(i?.price ?? i?.productId?.price) || 0),
        0
      )
    }
    return 0
  }

  if (loading) {
    return <div className="p-4">Loading orders…</div>
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {orders.length === 0 && !error && (
        <p>No orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o._id} className="border rounded-xl p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold">
                  Order ID: {o?._id ? o._id.slice(-6).toUpperCase() : '—'}
                </div>
                <div className="text-sm text-gray-600">
                  Status: {o?.status ?? 'pending'}
                </div>
              </div>

              {/* Total (safe across schema changes) */}
              <div className="font-bold text-green-700 text-lg">
                ₹{orderTotal(o).toFixed(2)}
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-3 mt-2">
              {(o?.items || []).map((i, idx) => (
                <div key={i?._id || idx} className="flex items-center gap-3">
                  <img
                    src={i?.productId?.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={i?.productId?.title || 'Product'}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <div className="font-semibold">
                      {i?.productId?.title || 'Product'}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{(i?.price ?? i?.productId?.price ?? 0)} × {i?.qty ?? 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Placed on{' '}
              {o?.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
