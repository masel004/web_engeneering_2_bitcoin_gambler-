import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Bets from './pages/Bets'
import BetDetail from './pages/BetDetail'
import PlaceBet from './pages/PlaceBet'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/bets" element={<Bets />} />
          <Route path="/bets/:id" element={<BetDetail />} />
          <Route path="/place-bet" element={<PlaceBet />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
