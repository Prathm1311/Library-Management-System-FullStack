import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { setupWebSocket } from '../utils/websocket'
import './Dashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberAnalytics, setMemberAnalytics] = useState(null)

  const [memberForm, setMemberForm] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  })

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  })

  const loadData = useCallback(async () => {
    try {
      const [membersRes, booksRes] = await Promise.all([
        api.get('/members'),
        api.get('/books')
      ])
      setMembers(membersRes.data)
      setBooks(booksRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/admin')
      return
    }
    loadData()
    // Setup WebSocket for real-time updates (optional, won't block if it fails)
    try {
      setupWebSocket(loadData)
    } catch (error) {
      console.warn('WebSocket setup failed, continuing without real-time updates:', error)
    }
  }, [navigate, loadData])

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMember) {
        await api.put(`/members/${editingMember.id}`, memberForm)
      } else {
        await api.post('/members', memberForm)
      }
      setShowMemberModal(false)
      setEditingMember(null)
      setMemberForm({ username: '', password: '', name: '', email: '' })
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving member')
    }
  }

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, bookForm)
      } else {
        await api.post('/books', bookForm)
      }
      setShowBookModal(false)
      setEditingBook(null)
      setBookForm({ title: '', author: '', isbn: '', category: '', totalCopies: 1 })
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving book')
    }
  }

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`)
        loadData()
      } catch (error) {
        alert('Error deleting member')
      }
    }
  }

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`)
        loadData()
      } catch (error) {
        alert('Error deleting book')
      }
    }
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setMemberForm({
      username: member.username,
      password: '',
      name: member.name || '',
      email: member.email || ''
    })
    setShowMemberModal(true)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      category: book.category || '',
      totalCopies: book.totalCopies
    })
    setShowBookModal(true)
  }

  const handleViewAnalytics = async (memberId) => {
    try {
      const response = await api.get(`/analytics/member/${memberId}`)
      setMemberAnalytics(response.data)
      setSelectedMember(response.data.member)
    } catch (error) {
      alert('Error loading analytics')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('role')
    navigate('/admin')
  }

  return (
    <div className="dashboard">
      <div className="navbar">
        <h1>Library Management - Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <div className="container">
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => { setEditingMember(null); setMemberForm({ username: '', password: '', name: '', email: '' }); setShowMemberModal(true) }}>
            Add Member
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingBook(null); setBookForm({ title: '', author: '', isbn: '', category: '', totalCopies: 1 }); setShowBookModal(true) }}>
            Add Book
          </button>
        </div>

        <div className="dashboard-sections">
          <div className="card">
            <h2>Members ({members.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Borrowed</th>
                  <th>Current Borrowed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No members found</td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr key={member.id}>
                      <td>{member.username}</td>
                      <td>{member.name || '-'}</td>
                      <td>{member.email || '-'}</td>
                      <td>{member.totalBooksBorrowed || 0}</td>
                      <td>{member.currentBooksBorrowed || 0}</td>
                      <td>
                        <button className="btn btn-success" onClick={() => handleViewAnalytics(member.id)}>Analytics</button>
                        <button className="btn btn-primary" onClick={() => handleEditMember(member)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteMember(member.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2>Books ({books.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Available Copies</th>
                  <th>Total Copies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No books found</td>
                  </tr>
                ) : (
                  books.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category || '-'}</td>
                      <td>{book.availableCopies || 0}</td>
                      <td>{book.totalCopies || 0}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleEditBook(book)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showMemberModal && (
        <div className="modal" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowMemberModal(false)}>&times;</span>
            <h2>{editingMember ? 'Edit Member' : 'Add Member'}</h2>
            <form onSubmit={handleMemberSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={memberForm.username}
                  onChange={(e) => setMemberForm({...memberForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password{editingMember && ' (leave empty to keep current)'}</label>
                <input
                  type="password"
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({...memberForm, password: e.target.value})}
                  required={!editingMember}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showBookModal && (
        <div className="modal" onClick={() => setShowBookModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowBookModal(false)}>&times;</span>
            <h2>{editingBook ? 'Edit Book' : 'Add Book'}</h2>
            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={bookForm.category}
                  onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Total Copies</label>
                <input
                  type="number"
                  value={bookForm.totalCopies}
                  onChange={(e) => setBookForm({...bookForm, totalCopies: parseInt(e.target.value) || 1})}
                  min="1"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowBookModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {memberAnalytics && (
        <div className="modal" onClick={() => setMemberAnalytics(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <span className="close" onClick={() => setMemberAnalytics(null)}>&times;</span>
            <h2>Member Analytics: {selectedMember?.username}</h2>
            <div className="stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="stat-card">
                <p>Total Books Borrowed</p>
                <h3>{memberAnalytics.totalBooksBorrowed}</h3>
              </div>
              <div className="stat-card">
                <p>Current Books Borrowed</p>
                <h3>{memberAnalytics.currentBooksBorrowed}</h3>
              </div>
              <div className="stat-card">
                <p>Total Borrowings</p>
                <h3>{memberAnalytics.totalBorrowings}</h3>
              </div>
              <div className="stat-card">
                <p>Active Borrowings</p>
                <h3>{memberAnalytics.activeBorrowings}</h3>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setMemberAnalytics(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard


