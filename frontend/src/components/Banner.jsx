import PrimaryButton from './PrimaryButton'

const Banner = ({ title, subtitle, description, buttonText }) => {
  return (
    <section className="banner" id="home">
      <div className="banner-content">
        <p className="section-kicker">{subtitle}</p>
        <h1>{title}</h1>
        <p className="banner-description">{description}</p>
        <PrimaryButton label={buttonText} href="#products" />
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
          <span>Electronics</span>
          <span>Fashion</span>
          <span>Home Goods</span>
          <span>Groceries</span>
        </div>
      </div>
    </section>
  )
}

export default Banner
