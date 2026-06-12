const FeatureSection = ({ title, description, features }) => {
  return (
    <section className="feature-section" id="products">
      <div className="section-heading">
        <p className="section-kicker">Why ShopHub?</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <span className="feature-number">{feature.id}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
