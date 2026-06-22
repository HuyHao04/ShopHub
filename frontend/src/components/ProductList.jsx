import ProductCard from './ProductCard'

const ProductList = ({ products, selectedProductId, onSelectProduct }) => {
  if (products.length === 0) {
    return <p className="empty-products">No products found for the selected filters.</p>
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onViewDetails={onSelectProduct}
        />
      ))}
    </>
  )
}

export default ProductList
