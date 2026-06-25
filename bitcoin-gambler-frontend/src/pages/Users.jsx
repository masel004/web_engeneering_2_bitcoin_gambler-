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
      setError('Failed to load users: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (username, balance) => {
    await createUser(username, balance)
    await fetchUsers()
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(id)
      await fetchUsers()
    } catch (err) {
      setError('Failed to delete user: ' + err.message)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Users</h1>

      {error && <p className="error">{error}</p>}

      <UserForm onSubmit={handleCreateUser} />

      <div className="card">
        <h2>All Users</h2>
        {users.length === 0 ? (
          <p>No users yet. Create one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <Link to={`/users/${user.id}`}>{user.username}</Link>
                  </td>
                  <td>${user.balance.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
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
