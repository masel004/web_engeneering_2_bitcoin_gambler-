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
        setError('Wette konnte nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    fetchBet()
  }, [id])

  if (loading) return <div className="container"><p>Laden...</p></div>
  if (!bet) return <div className="container"><p className="error">{error || 'Wette nicht gefunden'}</p></div>

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>Wette #{bet.id}</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3 style={{ fontSize: '1rem' }}>Details</h3>
        <table>
          <tbody>
            <tr>
              <td style={{ color: '#888' }}>Benutzer</td>
              <td><Link to={`/users/${bet.user?.id}`}>{bet.user?.username}</Link></td>
            </tr>
            <tr>
              <td style={{ color: '#888' }}>Betrag</td>
              <td>${bet.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ color: '#888' }}>Vorhersage</td>
              <td>{bet.prediction === 'up' ? 'Steigt' : 'Fällt'}</td>
            </tr>
            <tr>
              <td style={{ color: '#888' }}>Ergebnis</td>
              <td>
                <span className={`badge ${bet.won ? 'badge-won' : 'badge-lost'}`}>
                  {bet.won ? 'Gewonnen' : 'Verloren'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: '#888' }}>Auszahlung</td>
              <td style={{ color: bet.won ? '#00c853' : '#ff3d3d' }}>
                {bet.won ? `$${(bet.amount * 2).toFixed(2)}` : '$0.00'}
              </td>
            </tr>
            <tr>
              <td style={{ color: '#888' }}>Datum</td>
              <td>{bet.placedAt ? new Date(bet.placedAt).toLocaleString('de-DE') : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link to="/bets" className="btn btn-outline">Zurück zu Wetten</Link>
    </div>
  )
}

export default BetDetail
