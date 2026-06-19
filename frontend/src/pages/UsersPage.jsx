import { useState } from 'react'
import UserDetail from '../components/UserDetail'
import UserList from '../components/UserList'

const UsersPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null)

  return (
    <section className="users-section users-page" id="users">
      <div className="section-heading">
        <p className="section-kicker">Admin Preview</p>
        <h2>User Directory Demo</h2>
        <p>Review customer profiles with contact and delivery information.</p>
      </div>

      <div className="users-layout">
        <UserList selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
        <UserDetail userId={selectedUserId} />
      </div>
    </section>
  )
}

export default UsersPage
