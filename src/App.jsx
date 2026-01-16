import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import MemberLogin from './components/MemberLogin'
import AdminDashboard from './components/AdminDashboard'
import MemberDashboard from './components/MemberDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/login" element={<MemberLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App


