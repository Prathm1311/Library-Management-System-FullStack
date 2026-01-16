import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './Login.css'

function MemberLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/auth/login', { username, password })
      if (response.data.success) {
        localStorage.setItem('role', 'member')
        localStorage.setItem('memberId', response.data.memberId)
        localStorage.setItem('username', response.data.username)
        navigate('/member/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Member Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/admin" style={{ color: '#007bff' }}>Admin Login</a>
        </p>
      </div>
    </div>
  )
}

export default MemberLogin


