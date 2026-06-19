const Header = ({ title, navItems, logoSrc, onBrandClick, onNavigate }) => {
  const handleBrandClick = (event) => {
    if (onBrandClick) {
      event.preventDefault()
      onBrandClick()
    }
  }

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${title} home`} onClick={handleBrandClick}>
        {logoSrc ? (
          <img className="brand-logo" src={logoSrc} alt={`${title} logo`} />
        ) : (
          <span className="brand-fallback" aria-hidden="true">
            SH
          </span>
        )}
        <span className="brand-name">{title}</span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            className={item.active ? 'is-active' : ''}
            type="button"
            key={item.label}
            onClick={() => onNavigate(item)}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
