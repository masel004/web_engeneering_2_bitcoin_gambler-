import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBitcoinPrice, getBitcoinHistory, getBets, placeBet } from '../api/api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [price, setPrice] = useState(null)
  const [chartData, setChartData] = useState([])
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [amount, setAmount] = useState('100')
  const [prediction, setPrediction] = useState('up')
  const [timeframe, setTimeframe] = useState('5m')
  const [betResult, setBetResult] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }

    async function fetchData() {
      try {
        const [priceData, historyData, betsData] = await Promise.all([
          getBitcoinPrice(),
          getBitcoinHistory().catch(() => null),
          getBets(),
        ])
        setPrice(priceData.bitcoinPrice)

        if (historyData && historyData.prices) {
          const formatted = historyData.prices.map(([timestamp, value]) => ({
            time: new Date(timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            price: value,
          }))
          setChartData(formatted)
        }

        setBets(betsData)
      } catch (err) {
        setError('Daten konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, navigate])

  const userBets = bets.filter(b => b.user?.id === user?.id)
  const totalBet = userBets.reduce((sum, b) => sum + b.amount, 0)
  const wonBets = userBets.filter(b => b.won)
  const lostBets = userBets.filter(b => !b.won)
  const profit = wonBets.reduce((s, b) => s + b.amount, 0) - lostBets.reduce((s, b) => s + b.amount, 0)

  const handlePlaceBet = async () => {
    setBetResult(null)
    setError('')
    const betAmount = parseFloat(amount)
    if (!betAmount || betAmount <= 0) {
      setError('Bitte gültigen Betrag eingeben')
      return
    }
    try {
      const bet = await placeBet(user.id, betAmount, prediction, timeframe)
      setBetResult(bet)
      await refreshUser()
      const newBets = await getBets()
      setBets(newBets)
      setAmount('100')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return null
  if (loading) return <div className="container"><p>Laden...</p></div>

  const minPrice = chartData.length > 0 ? Math.min(...chartData.map(d => d.price)) * 0.999 : 0
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map(d => d.price)) * 1.001 : 0

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      {betResult && (
        <div className="success">
          Wette platziert! ${betResult.amount.toFixed(2)} auf "{betResult.prediction === 'up' ? 'Steigt' : 'Fällt'}" ({betResult.timeframe}). Ergebnis wird nach Ablauf berechnet.
        </div>
      )}

      <div className="dashboard-grid">
        {/* Linke Spalte - Statistiken */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Deine Statistiken</h3>
            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>Alle Zeiten</p>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(247, 147, 26, 0.15)' }}>
                <span style={{ color: '#f7931a' }}>$</span>
              </div>
              <div>
                <div className="stat-value">${totalBet.toFixed(2)}</div>
                <div className="stat-label">Gesamt gewettet</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(0, 200, 83, 0.15)' }}>
                <span style={{ color: '#00c853' }}>&#10003;</span>
              </div>
              <div>
                <div className="stat-value">{wonBets.length}</div>
                <div className="stat-label">Erfolgreiche Wetten</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 61, 61, 0.15)' }}>
                <span style={{ color: '#ff3d3d' }}>&#10007;</span>
              </div>
              <div>
                <div className="stat-value">{lostBets.length}</div>
                <div className="stat-label">Verlorene Wetten</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2a2d35', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
              <div className="stat-label">Gewinn / Verlust</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: profit >= 0 ? '#00c853' : '#ff3d3d' }}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(2)} $
              </div>
            </div>
          </div>

          <div className="card how-it-works">
            <h3 style={{ fontSize: '1rem' }}>So funktioniert's</h3>
            <ol>
              <li>Betrag wählen</li>
              <li>Auf Steigt oder Fällt setzen</li>
              <li>Ergebnis wird sofort berechnet</li>
              <li>Gewinne erhöhen dein Guthaben</li>
            </ol>
          </div>
        </div>

        {/* Mittlere Spalte - Chart */}
        <div>
          <div className="card">
            <div className="chart-header">
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bitcoin Live Kurs</span>
                <span className="live-badge">LIVE</span>
              </div>
            </div>

            {price && (
              <div style={{ marginBottom: '1rem' }}>
                <div className="price-big">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
            )}

            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00c853" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00c853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#333"
                    tick={{ fill: '#666', fontSize: 11 }}
                    tickLine={false}
                    interval={Math.floor(chartData.length / 6)}
                  />
                  <YAxis
                    stroke="#333"
                    tick={{ fill: '#666', fontSize: 11 }}
                    tickLine={false}
                    domain={[minPrice, maxPrice]}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1a1d23', border: '1px solid #2a2d35', borderRadius: '8px' }}
                    labelStyle={{ color: '#888' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Preis']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#00c853"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem' }}>Deine letzten Wetten</h3>
            {userBets.length === 0 ? (
              <p style={{ color: '#666' }}>Noch keine Wetten platziert.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Betrag</th>
                    <th>Vorhersage</th>
                    <th>Zeitraum</th>
                    <th>Ergebnis</th>
                  </tr>
                </thead>
                <tbody>
                  {userBets.slice(-5).reverse().map(bet => (
                    <tr key={bet.id}>
                      <td>${bet.amount.toFixed(2)}</td>
                      <td>{bet.prediction === 'up' ? 'Steigt' : 'Fällt'}</td>
                      <td>{bet.timeframe}</td>
                      <td>
                        {bet.resolved ? (
                          <span className={`badge ${bet.won ? 'badge-won' : 'badge-lost'}`}>
                            {bet.won ? 'Gewonnen' : 'Verloren'}
                          </span>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(247, 147, 26, 0.15)', color: '#f7931a' }}>
                            Ausstehend
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Rechte Spalte - Wette platzieren */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Wette platzieren</h3>

            <div className="bet-buttons">
              <button
                className={`bet-btn up ${prediction === 'up' ? 'active' : ''}`}
                onClick={() => setPrediction('up')}
              >
                &#8593; Steigt
              </button>
              <button
                className={`bet-btn down ${prediction === 'down' ? 'active' : ''}`}
                onClick={() => setPrediction('down')}
              >
                &#8595; Fällt
              </button>
            </div>

            <div className="form-group">
              <label>Zeitraum</label>
              <div className="amount-presets" style={{ marginBottom: '0' }}>
                {[
                  { value: '1m', label: '1 Min' },
                  { value: '5m', label: '5 Min' },
                  { value: '15m', label: '15 Min' },
                  { value: '30m', label: '30 Min' },
                  { value: '1h', label: '1 Std' },
                  { value: '2h', label: '2 Std' },
                ].map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeframe(t.value)}
                    style={{
                      background: timeframe === t.value ? '#00c853' : '#12151a',
                      color: timeframe === t.value ? '#fff' : '#e0e0e0',
                      borderColor: timeframe === t.value ? '#00c853' : '#2a2d35',
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Wettbetrag</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="amount-presets">
              {[10, 25, 50, 100, 250].map(val => (
                <button key={val} onClick={() => setAmount(val.toString())}>${val}</button>
              ))}
            </div>

            <div className="bet-summary">
              <div className="bet-summary-row">
                <span className="label">Wette</span>
                <span style={{ color: prediction === 'up' ? '#00c853' : '#ff3d3d' }}>
                  {prediction === 'up' ? 'Steigt' : 'Fällt'}
                </span>
              </div>
              <div className="bet-summary-row">
                <span className="label">Zeitraum</span>
                <span>{{ '1m': '1 Minute', '5m': '5 Minuten', '15m': '15 Minuten', '30m': '30 Minuten', '1h': '1 Stunde', '2h': '2 Stunden' }[timeframe]}</span>
              </div>
              <div className="bet-summary-row">
                <span className="label">Einsatz</span>
                <span>${parseFloat(amount || 0).toFixed(2)}</span>
              </div>
              <div className="bet-summary-row">
                <span className="label">Guthaben</span>
                <span>${user.balance?.toFixed(2)}</span>
              </div>
              <div className="bet-summary-row">
                <span className="label">Möglicher Gewinn</span>
                <span style={{ color: '#00c853' }}>${(parseFloat(amount || 0) * 2).toFixed(2)} (2x)</span>
              </div>
            </div>

            <button
              className="btn"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
              onClick={handlePlaceBet}
            >
              Wette platzieren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
