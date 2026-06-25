import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBetById } from '../api/api'

function BetDetail() {
  const { id } = useParams()
  const [bet, setBet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBet() {
      try {
        const data = await getBetById(id)
        setBet(data)
      } catch (err) {
        setError('Failed to load bet: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBet()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!bet) return <p className="error">{error || 'Bet not found'}</p>

  return (
    <div>
      <h1>Bet #{bet.id}</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h2>Details</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>User</strong></td>
              <td>
                <Link to={`/users/${bet.user?.id}`}>{bet.user?.username}</Link>
              </td>
            </tr>
            <tr>
              <td><strong>Amount</strong></td>
              <td>${bet.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Prediction</strong></td>
              <td>{bet.prediction}</td>
            </tr>
            <tr>
              <td><strong>Result</strong></td>
              <td>
                <span className={`badge ${bet.won ? 'badge-won' : 'badge-lost'}`}>
                  {bet.won ? 'Won' : 'Lost'}
                </span>
              </td>
            </tr>
            <tr>
              <td><strong>Payout</strong></td>
              <td>{bet.won ? `$${(bet.amount * 2).toFixed(2)}` : '$0.00'}</td>
            </tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>{bet.placedAt ? new Date(bet.placedAt).toLocaleString() : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link to="/bets">Back to Bets</Link>
    </div>
  )
}

export default BetDetail
