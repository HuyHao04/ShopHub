import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import { productsApi } from '../api/productsApi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await productsApi.getById(id)

        if (isCurrent) {
          const rawImageUrl = data.image_url || data.imageUrl || data.thumbnail || ''
          const finalImageUrl = (rawImageUrl.startsWith('http://') || rawImageUrl.startsWith('https://')) 
            ? rawImageUrl 
            : (rawImageUrl ? `http://localhost:8000${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}` : '')

          setProduct({
            ...data,
            title: data.name || data.title,
            thumbnail: finalImageUrl,
          })
        }
      } catch (err) {
        if (isCurrent) {
          if (err.message && err.message.toLowerCase().includes('not found')) {
            setError('not-found')
          } else {
            setError(err.message || 'Failed to load product details. Please try again.')
          }
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isCurrent = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <LoadingMessage message="Loading product details..." />
        </div>
      </main>
    )
  }

  if (error === 'not-found') {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-not-found">
            <p className="section-kicker">404</p>
            <h1>Product Not Found</h1>
            <p>The product you are looking for does not exist or has been removed.</p>
            <Link className="primary-button" to="/products">
              ← Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <ErrorMessage title="Error loading product" message={error} />
          <Link className="primary-button back-link" to="/products">
            ← Back to Products
          </Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return null
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <Link className="back-link" to="/products">
          ← Back to Products
        </Link>

        <div className="product-detail-layout">
          <div className="product-detail-image">
            <img src={product.thumbnail} alt={product.title} />
          </div>

          <div className="product-detail-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.title}</h1>
            <p className="product-price product-detail-price">
              {currencyFormatter.format(product.price)}
            </p>
            <p className="product-detail-desc">{product.description}</p>

            {product.rating ? (
              <p className="rating-copy">
                Rating: {product.rating} / 5
              </p>
            ) : null}

            {product.brand ? (
              <p className="product-brand">
                <strong>Brand:</strong> {product.brand}
              </p>
            ) : null}

            {product.stock !== undefined ? (
              <p className="product-stock">
                <strong>In Stock:</strong> {product.stock} units
              </p>
            ) : null}

            <button className="primary-button add-to-cart-btn" type="button">
              Add to Cart
            </button>
          </div>
        </div>

        {product.images && product.images.length > 1 ? (
          <div className="product-gallery">
            <h3>Product Gallery</h3>
            <div className="gallery-grid">
              {product.images.map((img, index) => (
                <div className="gallery-item" key={index}>
                  <img src={img} alt={`${product.title} - ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default ProductDetailPage
