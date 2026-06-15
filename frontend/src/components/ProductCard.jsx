const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductCard = ({ product, isSelected, onViewDetails }) => {
  return (
    <article className={`product-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="product-image-frame">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-price">{currencyFormatter.format(product.price)}</p>
        <button
          className="secondary-button"
          type="button"
          onClick={() => onViewDetails(product.id)}
          aria-pressed={isSelected}
        >
          View Details
        </button>
      </div>
    </article>
  )
}

export default ProductCard
