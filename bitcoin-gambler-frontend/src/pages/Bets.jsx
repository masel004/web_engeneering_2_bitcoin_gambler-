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
        setError('Wetten konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    fetchBets()
  }, [])

  if (loading) return <div className="container"><p>Laden...</p></div>

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1>Alle Wetten</h1>
      {error && <p className="error">{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" className="btn">Wette platzieren</Link>
      </div>

      {bets.length === 0 ? (
        <div className="card">
          <p style={{ color: '#666' }}>Noch keine Wetten platziert.</p>
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Benutzer</th>
                <th>Betrag</th>
                <th>Vorhersage</th>
                <th>Ergebnis</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {bets.map(bet => (
                <tr key={bet.id}>
                  <td><Link to={`/bets/${bet.id}`}>#{bet.id}</Link></td>
                  <td><Link to={`/users/${bet.user?.id}`}>{bet.user?.username}</Link></td>
                  <td>${bet.amount.toFixed(2)}</td>
                  <td>{bet.prediction === 'up' ? 'Steigt' : 'Fällt'}</td>
                  <td>
                    <span className={`badge ${bet.won ? 'badge-won' : 'badge-lost'}`}>
                      {bet.won ? 'Gewonnen' : 'Verloren'}
                    </span>
                  </td>
                  <td>{bet.placedAt ? new Date(bet.placedAt).toLocaleString('de-DE') : '-'}</td>
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
