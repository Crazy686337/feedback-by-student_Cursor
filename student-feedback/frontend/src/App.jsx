import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import FeedbackForm from './components/FeedbackForm.jsx'
import FeedbackList from './components/FeedbackList.jsx'
import Dashboard from './components/Dashboard.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')
  const login = (username, password) => {
    const ok = username === 'admin' && password === 'admin123'
    if (ok) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
    }
    return ok
  }
  const logout = () => {
    localStorage.removeItem('isAdmin')
    setIsAdmin(false)
  }
  return { isAdmin, login, logout }
}

export default function App() {
  const { isAdmin, login, logout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // noop; auth is stored in localStorage
  }, [])

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-semibold">Student Feedback</Link>
          <div className="flex gap-3 text-sm">
            <Link to="/">Form</Link>
            <Link to="/list">All Feedback</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isAdmin ? (
              <>
                <span className="text-sm text-green-600">Admin</span>
                <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
              </>
            ) : (
              <details>
                <summary className="cursor-pointer select-none">Admin Login</summary>
                <AdminLogin onLogin={(u, p) => {
                  const ok = login(u, p)
                  if (!ok) alert('Invalid credentials')
                  else navigate('/dashboard')
                }} />
              </details>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<FeedbackForm apiBase={API_BASE} />} />
          <Route path="/list" element={<FeedbackList apiBase={API_BASE} />} />
          <Route path="/dashboard" element={isAdmin ? <Dashboard apiBase={API_BASE} /> : <RequireAdmin />} />
        </Routes>
      </main>
    </div>
  )
}

function RequireAdmin() {
  return (
    <div className="p-6 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Admin Access Required</h2>
      <p>Please login as admin to view the dashboard.</p>
    </div>
  )
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className="mt-2 p-3 border rounded-md bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-2">
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => onLogin(username, password)}>Login</button>
      </div>
      <p className="text-xs text-gray-500 mt-1">Demo credentials: admin / admin123</p>
    </div>
  )
}

