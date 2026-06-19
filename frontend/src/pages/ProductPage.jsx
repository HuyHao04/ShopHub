import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import ProductDetail from '../components/ProductDetail'
import ProductList from '../components/ProductList'

const PRODUCT_API_URL = 'https://fakestoreapi.com/products'
const DEFAULT_CATEGORY = 'All'
const DEFAULT_SORT = 'none'

const mapProduct = (item) => ({
  id: item.id,
  name: item.title,
  price: item.price,
  category: item.category,
  imageUrl: item.image,
  description: item.description,
})

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [sortOption, setSortOption] = useState(DEFAULT_SORT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const sectionRef = useRef(null)

  const handleSectionClick = useCallback((event) => {
    if (!selectedProductId) return
    const clickedCard = event.target.closest('.product-card')
    const clickedDetail = event.target.closest('.detail-panel')
    const clickedToolbar = event.target.closest('.product-toolbar')
    if (!clickedCard && !clickedDetail && !clickedToolbar) {
      setSelectedProductId(null)
    }
  }, [selectedProductId])

  useEffect(() => {
    let isCurrent = true

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(PRODUCT_API_URL)
        const mappedProducts = response.data.map(mapProduct)

        if (isCurrent) {
          setProducts(mappedProducts)
          setFilteredProducts(mappedProducts)
        }
      } catch {
        if (isCurrent) {
          setError('Failed to load products. Please try again.')
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    const recalculateProducts = async () => {
      let updatedProducts = [...products]
      const normalizedSearch = searchTerm.trim().toLowerCase()

      if (normalizedSearch) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(normalizedSearch),
        )
      }

      if (selectedCategory !== DEFAULT_CATEGORY) {
        updatedProducts = updatedProducts.filter(
          (product) => product.category === selectedCategory,
        )
      }

      if (sortOption === 'price-asc') {
        updatedProducts.sort((first, second) => first.price - second.price)
      }

      if (sortOption === 'price-desc') {
        updatedProducts.sort((first, second) => second.price - first.price)
      }

      await Promise.resolve()

      if (isCurrent) {
        setFilteredProducts(updatedProducts)
      }
    }

    recalculateProducts()

    return () => {
      isCurrent = false
    }
  }, [products, searchTerm, selectedCategory, sortOption])

  const categories = [
    DEFAULT_CATEGORY,
    ...Array.from(new Set(products.map((product) => product.category))),
  ]

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory(DEFAULT_CATEGORY)
    setSortOption(DEFAULT_SORT)
  }

  return (
    <section className="catalog-section product-page" id="products" ref={sectionRef} onClick={handleSectionClick}>
      <div className="section-heading">
        <p className="section-kicker">Fresh Picks</p>
        <h2>Product Catalog</h2>
        <p>Browse everyday products across fashion, electronics, jewelry, and more.</p>
      </div>

      <div className="product-toolbar" aria-label="Product catalog controls">
        <label className="filter-control">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="filter-control">
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-control">
          <span>Sort</span>
          <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
            <option value="none">none</option>
            <option value="price-asc">Price: Low &rarr; High</option>
            <option value="price-desc">Price: High &rarr; Low</option>
          </select>
        </label>

        <button
          className="secondary-button clear-filters-button"
          type="button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {loading ? <LoadingMessage message="Loading products..." /> : null}
      {error ? <ErrorMessage title="Products could not load" message={error} /> : null}

      {!loading && !error ? (
        <>
          <p className="product-count">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="catalog-layout">
            <ProductList
              products={filteredProducts}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
            />
            <ProductDetail productId={selectedProductId} />
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ProductPage
