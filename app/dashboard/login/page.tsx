'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import '../dashboard.css'

export default function DashboardLogin() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regRole, setRegRole] = useState('member')

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPass,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regName.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPass,
      options: {
        data: { name: regName, role: regRole },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setError('')
      setTab('login')
      setLoading(false)
      // Show success inline
      setError('✓ Request submitted! An admin will approve your account.')
    }
  }

  return (
    <div className="cx-dash" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', display: 'flex' }}>
      <div style={{
        background: '#242424',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '440px',
        maxWidth: '95vw',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="CHANGE_X Academy of Business" style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }} />
        </div>

        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg,#00aeef,#8dc63f,#662d91,#ed1c24,#f7941d,#f9ed32,#39b54a)',
          borderRadius: '2px',
          marginBottom: '20px',
        }} />

        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '28px', letterSpacing: '1px' }}>
          Team Performance Dashboard &middot; Clear &middot; Aligned &middot; Effective
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1,
                padding: '10px',
                background: tab === t ? '#cc0000' : '#2e2e2e',
                border: `1px solid ${tab === t ? '#cc0000' : '#3a3a3a'}`,
                borderRadius: '8px',
                color: tab === t ? '#fff' : '#888',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Request Access'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            background: error.startsWith('✓') ? 'rgba(76,175,80,0.1)' : 'rgba(204,0,0,0.1)',
            border: `1px solid ${error.startsWith('✓') ? 'rgba(76,175,80,0.3)' : 'rgba(204,0,0,0.3)'}`,
            color: error.startsWith('✓') ? '#4caf50' : '#ff6b6b',
          }}>
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={doLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: '#cc0000', border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '1px', opacity: loading ? 0.7 : 1, fontFamily: 'Arial, Helvetica, sans-serif',
              }}
            >
              {loading ? 'Signing in…' : 'SIGN IN'}
            </button>
          </form>
        ) : (
          <form onSubmit={doRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Create a password" required minLength={6} />
            </div>
            <div className="form-group">
              <label>Role Request</label>
              <select value={regRole} onChange={e => setRegRole(e.target.value)}>
                <option value="member">Team Member</option>
                <option value="leader">Team Leader</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: '#cc0000', border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '1px', opacity: loading ? 0.7 : 1, fontFamily: 'Arial, Helvetica, sans-serif',
              }}
            >
              {loading ? 'Submitting…' : 'REQUEST ACCESS'}
            </button>
          </form>
        )}
      </div>

      <a
        href="/"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '20px',
          color: '#555',
          fontSize: '13px',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}
      >
        ← Back to main website
      </a>
    </div>
  )
}
