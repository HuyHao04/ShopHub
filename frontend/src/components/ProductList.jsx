import { useEffect, useState } from 'react'
import { getProducts } from '../services/fakeStoreApi'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'
import ProductCard from './ProductCard'

const ProductList = ({ selectedProductId, onSelectProduct }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setError('')
        const productData = await getProducts({ signal: controller.signal })
        setProducts(productData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load products right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [])

  if (isLoading) {
    return <LoadingMessage message="Loading products..." />
  }

  if (error) {
    return <ErrorMessage title="Products could not load" message={error} />
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onViewDetails={onSelectProduct}
        />
      ))}
    </div>
  )
}

export default ProductList
