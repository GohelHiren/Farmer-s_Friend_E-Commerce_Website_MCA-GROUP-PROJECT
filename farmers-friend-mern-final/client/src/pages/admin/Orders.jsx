import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  async function load() {
    const data = await api('/orders', { auth:true })
    setOrders(data.orders)
  }
  useEffect(()=>{ load() }, [])

  async function updateStatus(id, status) {
    await api(`/orders/${id}`, { method:'PATCH', body:{ status }, auth:true })
    await load()
  }

  return (
    <div className="card">
      <div className="font-semibold mb-2">All Orders</div>
      <div className="grid gap-3">
        {orders.map(o => (
          <div key={o._id} className="card">
            <div className="font-semibold">Order #{o._id}</div>
            <div>Amount: ₹{o.amount}</div>
            <div>Status: {o.status}</div>
            <div className="mt-2 flex gap-2">
              {['pending','shipped','delivered','cancelled'].map(s => (
                <button key={s} className="btn" onClick={()=>updateStatus(o._id, s)}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
