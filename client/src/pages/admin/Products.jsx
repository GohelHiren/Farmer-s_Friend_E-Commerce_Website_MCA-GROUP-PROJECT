import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [form, setForm] = useState({ title:'', price:0, unit:'kg', type:'fertilizer', categoryId:'', images:[] })

  async function load() {
    const data = await api('/products')
    setItems(data.items)
    const c = await api('/categories')
    setCats(c.items)
    if (!form.categoryId && c.items[0]) setForm(f => ({...f, categoryId: c.items[0]._id}))
  }
  useEffect(()=>{ load() }, [])

  async function create() {
    const body = { ...form, price: Number(form.price), stockQty: Number(form.stockQty||0) }
    await api('/products', { method:'POST', body, auth:true })
    setForm({ title:'', price:0, unit:'kg', type:'fertilizer', categoryId: form.categoryId, images:[] })
    await load()
  }
  async function remove(id) {
    if (!confirm('Delete product?')) return
    await api(`/products/${id}`, { method:'DELETE', auth:true })
    await load()
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="font-semibold mb-2">Add Product</div>
        <div className="grid md:grid-cols-4 gap-3">
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="input" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
          <select className="select" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})}>
            <option>kg</option><option>g</option><option>litre</option><option>ml</option><option>packet</option><option>bag</option>
          </select>
          <select className="select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option>fertilizer</option><option>seed</option><option>pesticide</option><option>organic</option><option>tool</option>
          </select>
          <select className="select" value={form.categoryId} onChange={e=>setForm({...form, categoryId:e.target.value})}>
            {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className="input col-span-2" placeholder="Image URL" onChange={e=>setForm({...form, images:[e.target.value]})} />
          <input className="input" placeholder="Stock Qty" value={form.stockQty||''} onChange={e=>setForm({...form, stockQty:e.target.value})} />
          <button className="btn btn-primary" onClick={create}>Create</button>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">All Products</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map(p => (
            <div key={p._id} className="card">
              <img src={p.images?.[0] || 'https://via.placeholder.com/300x180?text=Product'} className="w-full h-32 object-cover rounded-xl" />
              <div className="mt-2 font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">₹{p.price} / {p.unit}</div>
              <button className="btn mt-2" onClick={()=>remove(p._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
