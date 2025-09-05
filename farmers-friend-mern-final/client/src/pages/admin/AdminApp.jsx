import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { currentUser, clearAuth } from '../../lib/api'
import AdminDashboard from './Dashboard.jsx'
import AdminProducts from './Products.jsx'
import AdminOrders from './Orders.jsx'
import AdminUsers from './Users.jsx'

export default function AdminApp() {
  const user = currentUser()
  const nav = useNavigate()
  if (!user || user.role !== 'admin') return <div className="container mt-6"><div className="card">Forbidden</div></div>
  return (
    <div className="container">
      <div className="grid md:grid-cols-[240px_1fr] gap-4 mt-4">
        <aside className="card h-max">
          <div className="text-xl font-bold mb-3">Admin</div>
          <nav className="grid gap-2">
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/users">Users</Link>
            <button className="btn mt-4" onClick={()=>{ clearAuth(); nav('/'); }}>Logout</button>
          </nav>
        </aside>
        <main className="grid gap-4">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
