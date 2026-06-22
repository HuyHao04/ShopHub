import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main className="not-found-page">
      <div className="not-found-container">
        <p className="not-found-code">404</p>
        <h1>Page Not Found</h1>
        <p className="not-found-desc">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link className="primary-button" to="/">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
