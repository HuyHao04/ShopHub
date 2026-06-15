const Header = ({ title, navItems, logoSrc }) => {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${title} home`}>
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
          <a className={item.active ? 'is-active' : ''} key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
