import { useEffect, useState } from 'react'
import { getProductById } from '../services/fakeStoreApi'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) {
      return undefined
    }

    const controller = new AbortController()

    const loadProductDetail = async () => {
      try {
        setIsLoading(true)
        setError('')
        const productData = await getProductById(productId, { signal: controller.signal })
        setProduct(productData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this product.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProductDetail()

    return () => controller.abort()
  }, [productId])

  if (!productId) {
    return (
      <aside className="detail-panel empty-detail">
        <p className="section-kicker">Product Detail</p>
        <h3>No product selected</h3>
        <p>Detailed product information will appear here.</p>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className="detail-panel">
        <LoadingMessage message="Loading product details..." />
      </aside>
    )
  }

  if (error) {
    return (
      <aside className="detail-panel">
        <ErrorMessage title="Product detail could not load" message={error} />
      </aside>
    )
  }

  if (!product) {
    return null
  }

  return (
    <aside className="detail-panel product-detail">
      <p className="section-kicker">Product Detail</p>
      <div className="detail-image-frame">
        <img src={product.image} alt={product.title} />
      </div>
      <h3>{product.title}</h3>
      <p className="product-price">{currencyFormatter.format(product.price)}</p>
      <p className="product-category">{product.category}</p>
      <p>{product.description}</p>
      {product.rating ? (
        <p className="rating-copy">
          Rating: {product.rating.rate} / 5 from {product.rating.count} reviews
        </p>
      ) : null}
    </aside>
  )
}

export default ProductDetail
