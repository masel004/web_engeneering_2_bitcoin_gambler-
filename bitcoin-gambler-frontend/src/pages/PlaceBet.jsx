import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, placeBet, getBitcoinPrice } from '../api/api'

function PlaceBet() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [prediction, setPrediction] = useState('up')
  const [price, setPrice] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, priceData] = await Promise.all([
          getUsers(),
          getBitcoinPrice()
        ])
        setUsers(usersData)
        setPrice(priceData.bitcoinPrice)
        if (usersData.length > 0) {
          setUserId(usersData[0].id.toString())
        }
      } catch (err) {
        setError('Failed to load data: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!userId) {
      setError('Please select a user')
      return
    }

    const betAmount = parseFloat(amount)
    if (!betAmount || betAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      const bet = await placeBet(parseInt(userId), betAmount, prediction)
      setSuccess(
        bet.won
          ? `You won! Payout: $${(bet.amount * 2).toFixed(2)}`
          : `You lost $${bet.amount.toFixed(2)}. Better luck next time!`
      )
      setAmount('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Loading...</p>

  const selectedUser = users.find(u => u.id.toString() === userId)

  return (
    <div>
      <h1>Place a Bet</h1>

      {price && (
        <div className="card">
          <p>Current Bitcoin Price: <strong style={{ color: '#f7931a' }}>
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong></p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {success && (
        <div className="card" style={{ borderColor: success.includes('won') ? '#28a745' : '#dc3545' }}>
          <p>{success}</p>
        </div>
      )}

      {users.length === 0 ? (
        <div className="card">
          <p>No users available. Please <a href="/users">create a user</a> first.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label>User</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} (Balance: ${user.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <p style={{ color: '#aaa', marginBottom: '1rem' }}>
              Available Balance: ${selectedUser.balance.toFixed(2)}
            </p>
          )}

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter bet amount"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Prediction</label>
            <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>

          <button type="submit" className="btn">Place Bet</button>
        </form>
      )}
    </div>
  )
}

export default PlaceBet
