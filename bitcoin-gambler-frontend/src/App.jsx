import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import UserDetail from './pages/UserDetail'
import Bets from './pages/Bets'
import BetDetail from './pages/BetDetail'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/bets" element={<Bets />} />
          <Route path="/bets/:id" element={<BetDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
