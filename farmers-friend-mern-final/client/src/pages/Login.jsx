import { useState } from 'react'
import { api, setAuth } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const data = await api('/auth/login', { method:'POST', body:{ email, password } })
      setAuth(data)
      if (data.user.role === 'admin') nav('/admin')
      else nav('/')
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Login</h2>
      <form onSubmit={submit} className="grid gap-3 mt-3">
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  )
}
