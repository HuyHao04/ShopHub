import { useEffect, useState } from 'react'
import { getUsers } from '../services/fakeStoreApi'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'

const getFullName = (user) => {
  return `${user.name?.firstname || ''} ${user.name?.lastname || ''}`.trim()
}

const UserList = ({ selectedUserId, onSelectUser }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadUsers = async () => {
      try {
        setIsLoading(true)
        setError('')
        const userData = await getUsers({ signal: controller.signal })
        setUsers(userData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load users right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadUsers()

    return () => controller.abort()
  }, [])

  if (isLoading) {
    return <LoadingMessage message="Loading users..." />
  }

  if (error) {
    return <ErrorMessage title="Users could not load" message={error} />
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <button
          className={`user-card ${selectedUserId === user.id ? 'is-selected' : ''}`}
          type="button"
          key={user.id}
          onClick={() => onSelectUser(user.id)}
        >
          <span className="user-username">@{user.username}</span>
          <strong>{getFullName(user)}</strong>
          <span>{user.email}</span>
        </button>
      ))}
    </div>
  )
}

export default UserList
