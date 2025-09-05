import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const [cart, setCart] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' })
  const nav = useNavigate()

  useEffect(() => {
    (async () => {
      const data = await api('/cart', { auth: true })
      setCart(data.cart || { items: [] })
    })()
  }, [])

  const total = (cart?.items || []).reduce(
    (s, i) => s + (i.productId?.price || 0) * (i.qty || 0), 0
  )

  async function placeOrder() {
    const start = await api('/cart/checkout', {
      method: 'POST',
      body: { paymentMethod, address },
      auth: true
    })

    if (paymentMethod === 'cod') {
      alert('Order placed (Cash on Delivery)')
      return nav('/orders')
    }

    // online payment
    if (start.razorpay.orderId === 'order_mock123') {
      // fake flow
      await api('/payments/verify', {
        method: 'POST',
        auth: true,
        body: {
          orderId: start.order._id,
          razorpay_order_id: 'order_mock123',
          razorpay_payment_id: 'pay_mock123',
          razorpay_signature: 'sig_mock123'
        }
      })
      alert('Payment simulated successfully!')
      return nav('/orders')
    }

    // real Razorpay flow (when keys exist)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: start.razorpay.amount,
      currency: start.razorpay.currency,
      name: 'Farmer’s Friend',
      order_id: start.razorpay.orderId,
      handler: async function (resp) {
        await api('/payments/verify', {
          method: 'POST',
          auth: true,
          body: {
            orderId: start.order._id,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature
          }
        })
        alert('Payment successful!')
        nav('/orders')
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (!cart) return <div className="p-4">Loading…</div>

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Checkout</h2>

      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Street" value={address.street} onChange={e=>setAddress({...address,street:e.target.value})}/>
        <input className="input" placeholder="City" value={address.city} onChange={e=>setAddress({...address,city:e.target.value})}/>
        <input className="input" placeholder="State" value={address.state} onChange={e=>setAddress({...address,state:e.target.value})}/>
        <input className="input" placeholder="Pincode" value={address.pincode} onChange={e=>setAddress({...address,pincode:e.target.value})}/>
      </div>

      <div className="flex gap-4">
        <label><input type="radio" value="cod" checked={paymentMethod==='cod'} onChange={()=>setPaymentMethod('cod')}/> COD</label>
        <label><input type="radio" value="online" checked={paymentMethod==='online'} onChange={()=>setPaymentMethod('online')}/> Pay Online</label>
      </div>

      <div className="flex justify-between font-bold">
        <span>Total</span><span>₹{total.toFixed(2)}</span>
      </div>

      <button className="btn btn-primary w-full" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  )
}
