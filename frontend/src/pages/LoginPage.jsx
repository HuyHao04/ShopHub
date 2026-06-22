import { useState } from 'react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <p className="section-kicker">Welcome Back</p>
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {submitted ? (
            <div className="status-message status-loading">
              Login functionality will be implemented in a future session.
            </div>
          ) : null}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Username / Email</span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </label>

            <button className="primary-button login-submit" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
