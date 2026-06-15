import { useEffect, useState } from 'react'
import { getUserById } from '../services/fakeStoreApi'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'

const getFullName = (user) => {
  return `${user.name?.firstname || ''} ${user.name?.lastname || ''}`.trim()
}

const getAddress = (address) => {
  if (!address) {
    return 'No address available'
  }

  const streetAddress = [address.number, address.street].filter(Boolean).join(' ')
  return [streetAddress, address.city, address.zipcode].filter(Boolean).join(', ')
}

const UserDetail = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      return undefined
    }

    const controller = new AbortController()

    const loadUserDetail = async () => {
      try {
        setIsLoading(true)
        setError('')
        const userData = await getUserById(userId, { signal: controller.signal })
        setUser(userData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this user.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadUserDetail()

    return () => controller.abort()
  }, [userId])

  if (!userId) {
    return (
      <aside className="detail-panel empty-detail">
        <p className="section-kicker">User Detail</p>
        <h3>No user selected</h3>
        <p>Customer contact and address details will appear here.</p>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className="detail-panel">
        <LoadingMessage message="Loading user details..." />
      </aside>
    )
  }

  if (error) {
    return (
      <aside className="detail-panel">
        <ErrorMessage title="User detail could not load" message={error} />
      </aside>
    )
  }

  if (!user) {
    return null
  }

  return (
    <aside className="detail-panel user-detail">
      <p className="section-kicker">User Detail</p>
      <h3>@{user.username}</h3>
      <dl>
        <div>
          <dt>Full name</dt>
          <dd>{getFullName(user)}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{user.phone}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{getAddress(user.address)}</dd>
        </div>
      </dl>
    </aside>
  )
}

export default UserDetail
