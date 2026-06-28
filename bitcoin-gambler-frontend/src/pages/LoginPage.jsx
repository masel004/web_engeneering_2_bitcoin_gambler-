import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../api/api'

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [balance, setBalance] = useState('1000')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Benutzername ist erforderlich')
      return
    }
    if (!password) {
      setError('Passwort ist erforderlich')
      return
    }

    try {
      let user
      if (isRegister) {
        user = await registerUser(username.trim(), password, parseFloat(balance) || 0)
      } else {
        user = await loginUser(username.trim(), password)
      }
      login(user)
      navigate('/')
    } catch (err) {
      setError(isRegister
        ? 'Registrierung fehlgeschlagen: ' + err.message
        : 'Benutzername oder Passwort falsch'
      )
    }
  }

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          background: '#f7931a',
          color: '#fff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>B</div>
        <h1 style={{ fontSize: '1.5rem' }}>BTC Gambler</h1>
        <p style={{ color: '#888' }}>Bitcoin Kurs Vorhersagen</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #2a2d35' }}>
          <button
            onClick={() => { setIsRegister(false); setError('') }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: !isRegister ? '#00c853' : '#666',
              borderBottom: !isRegister ? '2px solid #00c853' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >Anmelden</button>
          <button
            onClick={() => { setIsRegister(true); setError('') }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: isRegister ? '#00c853' : '#666',
              borderBottom: isRegister ? '2px solid #00c853' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >Registrieren</button>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Benutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Benutzername eingeben"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Startguthaben ($)</label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="1000"
                min="0"
                step="0.01"
              />
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', padding: '0.85rem' }}>
            {isRegister ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
