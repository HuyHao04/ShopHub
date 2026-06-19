const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductCard = ({ product, isSelected, onViewDetails }) => {
  const productName = product.name || product.title
  const imageUrl = product.imageUrl || product.image

  return (
    <article className={`product-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="product-image-frame">
        <img src={imageUrl} alt={productName} loading="lazy" />
      </div>

      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>{productName}</h3>
        <p className="product-price">{currencyFormatter.format(product.price)}</p>
        <p className="product-description">{product.description}</p>
        <button
          className="secondary-button product-detail-button"
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
