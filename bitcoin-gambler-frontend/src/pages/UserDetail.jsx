import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserById, getBetsByUserId, getTransactionsByUserId, deposit } from '../api/api'

function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [bets, setBets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [depositAmount, setDepositAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [userData, betsData, transData] = await Promise.all([
        getUserById(id),
        getBetsByUserId(id),
        getTransactionsByUserId(id)
      ])
      setUser(userData)
      setBets(betsData)
      setTransactions(transData)
    } catch (err) {
      setError('Benutzer konnte nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])

  const handleDeposit = async (e) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) return
    try {
      await deposit(parseInt(id), amount)
      setDepositAmount('')
      await fetchData()
    } catch (err) {
      setError('Einzahlung fehlgeschlagen: ' + err.message)
    }
  }

  if (loading) return <div className="container"><p>Laden...</p></div>
  if (!user) return <div className="container"><p className="error">{error || 'Benutzer nicht gefunden'}</p></div>

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1>{user.username}</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3 style={{ fontSize: '1rem' }}>Profil</h3>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Guthaben:</strong> <span style={{ color: '#00c853', fontWeight: 600 }}>${user.balance.toFixed(2)}</span></p>

        <form onSubmit={handleDeposit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Betrag"
            min="0.01"
            step="0.01"
            style={{
              padding: '0.5rem',
              background: '#12151a',
              border: '1px solid #2a2d35',
              borderRadius: '8px',
              color: '#e0e0e0'
            }}
          />
          <button type="submit" className="btn">Einzahlen</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem' }}>Wetten ({bets.length})</h3>
        {bets.length === 0 ? (
          <p style={{ color: '#666' }}>Noch keine Wetten. <Link to="/">Jetzt wetten</Link></p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem' }}>Transaktionen ({transactions.length})</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#666' }}>Noch keine Transaktionen.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Typ</th>
                <th>Betrag</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.type === 'DEPOSIT' ? 'Einzahlung' : tx.type === 'BET_PLACED' ? 'Wetteinsatz' : tx.type === 'BET_WON' ? 'Gewinn' : tx.type}</td>
                  <td style={{ color: tx.type === 'BET_WON' || tx.type === 'DEPOSIT' ? '#00c853' : '#ff3d3d' }}>
                    {tx.type === 'BET_PLACED' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                  <td>{tx.timestamp ? new Date(tx.timestamp).toLocaleString('de-DE') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default UserDetail
