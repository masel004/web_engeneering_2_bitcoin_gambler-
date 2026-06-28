import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, createUser, deleteUser } from '../api/api'
import UserForm from '../components/UserForm'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError('Benutzer konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreateUser = async (username, balance) => {
    await createUser(username, balance)
    await fetchUsers()
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Benutzer wirklich löschen?')) return
    try {
      await deleteUser(id)
      await fetchUsers()
    } catch (err) {
      setError('Löschen fehlgeschlagen: ' + err.message)
    }
  }

  if (loading) return <div className="container"><p>Laden...</p></div>

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Benutzer</h1>
      {error && <p className="error">{error}</p>}

      <UserForm onSubmit={handleCreateUser} />

      <div className="card">
        <h3 style={{ fontSize: '1rem' }}>Alle Benutzer</h3>
        {users.length === 0 ? (
          <p style={{ color: '#666' }}>Noch keine Benutzer. Erstelle einen oben.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Benutzername</th>
                <th>Guthaben</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
                  <td>${user.balance.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Users
