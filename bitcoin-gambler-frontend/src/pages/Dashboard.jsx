import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBitcoinPrice, getBets } from '../api/api'

function Dashboard() {
  const [price, setPrice] = useState(null)
  const [recentBets, setRecentBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [priceData, betsData] = await Promise.all([
          getBitcoinPrice(),
          getBets()
        ])
        setPrice(priceData.bitcoinPrice)
        setRecentBets(betsData.slice(-5).reverse())
      } catch (err) {
        setError('Failed to load data: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h2>Current Bitcoin Price</h2>
        {price ? (
          <div className="price-display">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        ) : (
          <p>Could not load price</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/place-bet" className="btn">Place a Bet</Link>
        <Link to="/users" className="btn" style={{ background: '#16213e', color: '#f7931a' }}>
          Manage Users
        </Link>
      </div>

      <div className="card">
        <h2>Recent Bets</h2>
        {recentBets.length === 0 ? (
          <p>No bets placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Prediction</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {recentBets.map(bet => (
                <tr key={bet.id}>
                  <td>
                    <Link to={`/users/${bet.user?.id}`}>{bet.user?.username}</Link>
                  </td>
                  <td>${bet.amount.toFixed(2)}</td>
                  <td>{bet.prediction}</td>
                  <td>
                    <span className={`badge ${bet.won ? 'badge-won' : 'badge-lost'}`}>
                      {bet.won ? 'Won' : 'Lost'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard
