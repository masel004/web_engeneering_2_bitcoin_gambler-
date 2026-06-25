import { useState } from 'react'

function UserForm({ onSubmit }) {
  const [username, setUsername] = useState('')
  const [balance, setBalance] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    try {
      await onSubmit(username.trim(), parseFloat(balance) || 0)
      setUsername('')
      setBalance('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Create User</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className="form-group">
        <label>Initial Balance ($)</label>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
        />
      </div>
      <button type="submit" className="btn">Create User</button>
    </form>
  )
}

export default UserForm
