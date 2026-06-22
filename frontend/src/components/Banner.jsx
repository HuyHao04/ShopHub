import { Link } from 'react-router-dom'

const Banner = ({ title, subtitle, description, buttonText }) => {
  return (
    <section className="banner" id="home">
      <div className="banner-content">
        <p className="section-kicker">{subtitle}</p>
        <h1>{title}</h1>
        <p className="banner-description">{description}</p>
        <Link className="primary-button" to="/products">
          {buttonText}
        </Link>
      </div>

      <div className="shopping-preview" aria-label="ShopHub shopping preview">
        <div className="preview-toolbar">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="preview-row">
          <span className="preview-thumb"></span>
          <div>
            <strong>Daily Deals</strong>
            <small>Fresh products and trusted shops</small>
          </div>
        </div>
        <div className="preview-grid">
          <Link to="/products?category=Electronics" style={{textDecoration: 'none'}}><span>Electronics</span></Link>
          <Link to="/products?category=Fashion" style={{textDecoration: 'none'}}><span>Fashion</span></Link>
          <Link to="/products?category=Home Goods" style={{textDecoration: 'none'}}><span>Home Goods</span></Link>
          <Link to="/products?category=Groceries" style={{textDecoration: 'none'}}><span>Groceries</span></Link>
        </div>
      </div>
    </section>
  )
}

export default Banner
