import { NavLink } from 'react-router-dom'

const logoModules = import.meta.glob('../assets/logo.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const logoSrc = logoModules['../assets/logo.png'] || ''

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Login', to: '/login' },
  { label: 'Users', to: '/users' },
]

const activeStyle = ({ isActive }) => ({
  color: isActive ? '#ffffff' : undefined,
  background: isActive ? '#0f766e' : undefined,
  fontWeight: isActive ? 800 : undefined,
})

const Header = ({ title = 'ShopHub' }) => {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/" aria-label={`${title} home`}>
        {logoSrc ? (
          <img className="brand-logo" src={logoSrc} alt={`${title} logo`} />
        ) : (
          <span className="brand-fallback" aria-hidden="true">
            SH
          </span>
        )}
        <span className="brand-name">{title}</span>
      </NavLink>

      <nav className="main-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === '/'}
            style={activeStyle}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
