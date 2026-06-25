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
      setError('Failed to load user: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleDeposit = async (e) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) return

    try {
      await deposit(parseInt(id), amount)
      setDepositAmount('')
      await fetchData()
    } catch (err) {
      setError('Deposit failed: ' + err.message)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!user) return <p className="error">{error || 'User not found'}</p>

  return (
    <div>
      <h1>{user.username}</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h2>Profile</h2>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>

        <form onSubmit={handleDeposit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount"
            min="0.01"
            step="0.01"
            style={{
              padding: '0.5rem',
              background: '#16213e',
              border: '1px solid #2a2a3e',
              borderRadius: '6px',
              color: '#e0e0e0'
            }}
          />
          <button type="submit" className="btn">Deposit</button>
        </form>
      </div>

      <div className="card">
        <h2>Bets ({bets.length})</h2>
        {bets.length === 0 ? (
          <p>No bets placed yet. <Link to="/place-bet">Place one now</Link></p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
        )}
      </div>

      <div className="card">
        <h2>Transactions ({transactions.length})</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.type}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '-'}</td>
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
