import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      background: '#1a1a2e',
      borderBottom: '2px solid #f7931a',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f7931a' }}>
        Bitcoin Gambler
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/bets">Bets</Link>
        <Link to="/place-bet">Place Bet</Link>
      </div>
    </nav>
  )
}

export default Navbar
