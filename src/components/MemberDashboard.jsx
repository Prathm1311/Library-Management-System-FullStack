import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { setupWebSocket } from '../utils/websocket'
import './Dashboard.css'

function MemberDashboard() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [myBorrowings, setMyBorrowings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const memberId = localStorage.getItem('memberId')
  const username = localStorage.getItem('username')

  useEffect(() => {
    if (localStorage.getItem('role') !== 'member' || !memberId) {
      navigate('/login')
      return
    }
    loadData()
    // Setup WebSocket for real-time updates (optional, won't block if it fails)
    try {
      setupWebSocket(loadData)
    } catch (error) {
      console.warn('WebSocket setup failed, continuing without real-time updates:', error)
    }
  }, [navigate, memberId])


  const loadData = async () => {
    try {
      const [booksRes, borrowingsRes] = await Promise.all([
        api.get('/books'),
        api.get(`/borrowings/member/${memberId}`)
      ])
      setBooks(booksRes.data)
      setMyBorrowings(borrowingsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleBorrowBook = async (bookId) => {
    if (window.confirm('Do you want to borrow this book?')) {
      try {
        await api.post('/borrowings/borrow', { memberId, bookId })
        loadData()
        alert('Book borrowed successfully!')
      } catch (error) {
        alert(error.response?.data?.error || 'Error borrowing book')
      }
    }
  }

  const handleReturnBook = async (borrowingId) => {
    if (window.confirm('Do you want to return this book?')) {
      try {
        await api.post(`/borrowings/return/${borrowingId}`)
        loadData()
        alert('Book returned successfully!')
      } catch (error) {
        alert(error.response?.data?.error || 'Error returning book')
      }
    }
  }

  const handleSearch = async () => {
    try {
      const response = await api.get(`/books?search=${searchQuery}`)
      setBooks(response.data)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('memberId')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const activeBorrowings = myBorrowings.filter(b => !b.returned)

  return (
    <div className="dashboard">
      <div className="navbar">
        <h1>Library Management - Welcome {username}</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <div className="container">
        <div className="card">
          <h2>My Borrowings ({activeBorrowings.length} active)</h2>
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBorrowings.map(borrowing => (
                <tr key={borrowing.id}>
                  <td>{borrowing.bookTitle}</td>
                  <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                  <td>{borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : '-'}</td>
                  <td>{borrowing.returned ? 'Returned' : 'Active'}</td>
                  <td>
                    {!borrowing.returned && (
                      <button className="btn btn-success" onClick={() => handleReturnBook(borrowing.id)}>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {myBorrowings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No borrowings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Available Books</h2>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
            <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); loadData() }}>Clear</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Available Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category || '-'}</td>
                  <td>{book.availableCopies}</td>
                  <td>
                    {book.availableCopies > 0 ? (
                      <button className="btn btn-primary" onClick={() => handleBorrowBook(book.id)}>
                        Borrow
                      </button>
                    ) : (
                      <span style={{ color: '#dc3545' }}>Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MemberDashboard


