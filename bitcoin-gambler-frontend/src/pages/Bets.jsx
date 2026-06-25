import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBets } from '../api/api'

function Bets() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBets() {
      try {
        const data = await getBets()
        setBets(data.reverse())
      } catch (err) {
        setError('Failed to load bets: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBets()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>All Bets</h1>

      {error && <p className="error">{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/place-bet" className="btn">Place a Bet</Link>
      </div>

      {bets.length === 0 ? (
        <div className="card">
          <p>No bets placed yet.</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Prediction</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bets.map(bet => (
                <tr key={bet.id}>
                  <td><Link to={`/bets/${bet.id}`}>#{bet.id}</Link></td>
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
                  <td>{bet.placedAt ? new Date(bet.placedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Bets
