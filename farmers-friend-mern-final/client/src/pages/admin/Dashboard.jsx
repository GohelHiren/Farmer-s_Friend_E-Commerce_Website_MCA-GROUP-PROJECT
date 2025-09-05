import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, BarChart, Bar } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  useEffect(()=>{ (async()=>{ setStats(await api('/admin/stats', { auth:true })) })() }, [])

  if (!stats) return <div className="card">Loading dashboard...</div>

  const ordersData = stats.ordersByDate.map(d => ({ date: d._id, orders: d.count, revenue: d.revenue }))
  const salesData = stats.salesByCategory.map(s => ({ name: s._id || 'Other', value: s.total }))

  return (
    <div className="grid gap-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card"><div className="text-gray-600">Products</div><div className="text-2xl font-bold">{stats.products}</div></div>
        <div className="card"><div className="text-gray-600">Orders</div><div className="text-2xl font-bold">{stats.orders}</div></div>
        <div className="card"><div className="text-gray-600">Users</div><div className="text-2xl font-bold">{stats.users}</div></div>
        <div className="card"><div className="text-gray-600">Revenue</div><div className="text-2xl font-bold">₹{stats.revenue}</div></div>
      </div>

      <div className="card h-72">
        <div className="font-semibold mb-2">Orders Trend (last 30 days)</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card h-72">
          <div className="font-semibold mb-2">Sales by Category</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={salesData} dataKey="value" nameKey="name" outerRadius={100} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card h-72">
          <div className="font-semibold mb-2">Revenue by Day</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
