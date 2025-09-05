import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  useEffect(()=>{ (async()=>{ const data = await api('/users', { auth:true }); setUsers(data.users) })() }, [])
  return (
    <div className="card">
      <div className="font-semibold mb-2">Users</div>
      <div className="grid gap-2">
        {users.map(u => (
          <div key={u._id} className="flex items-center justify-between border-b py-2">
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="text-sm">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
