import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    color: isActive(path) ? '#00c853' : '#888',
    fontWeight: isActive(path) ? 600 : 400,
    borderBottom: isActive(path) ? '2px solid #00c853' : '2px solid transparent',
    paddingBottom: '0.3rem',
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: '#12151a',
      borderBottom: '1px solid #1e2028',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            background: '#f7931a',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 700,
          }}>B</span>
          BTC Gambler
        </Link>
        {user && (
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={linkStyle('/')}>Live</Link>
            <Link to="/bets" style={linkStyle('/bets')}>Wetten</Link>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user ? (
          <>
            <span style={{ color: '#00c853', fontWeight: 600 }}>
              ${user.balance?.toFixed(2)}
            </span>
            <span style={{ color: '#ccc' }}>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'transparent',
                border: '1px solid #2a2d35',
                borderRadius: '6px',
                color: '#888',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >Abmelden</button>
          </>
        ) : (
          <Link to="/login" style={{
            padding: '0.4rem 1rem',
            border: '1px solid #00c853',
            borderRadius: '6px',
            color: '#00c853',
            fontSize: '0.9rem',
          }}>Anmelden</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
