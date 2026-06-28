import { createContext, useContext, useState, useEffect } from 'react'
import { getUserById } from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      getUserById(parsed.id)
        .then(setUser)
        .catch(() => localStorage.removeItem('user'))
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const refreshUser = async () => {
    if (user) {
      try {
        const updated = await getUserById(user.id)
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
      } catch {}
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
