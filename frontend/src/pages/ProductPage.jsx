import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import ProductList from '../components/ProductList'

const PRODUCT_API_URL = 'https://dummyjson.com/products?limit=0'
const DEFAULT_CATEGORY = 'All'
const DEFAULT_SORT = 'none'

const categoryMapping = {
  'smartphones': 'Electronics',
  'laptops': 'Electronics',
  'tablets': 'Electronics',
  'mobile-accessories': 'Electronics',
  'mens-shirts': 'Fashion',
  'mens-shoes': 'Fashion',
  'mens-watches': 'Fashion',
  'womens-bags': 'Fashion',
  'womens-dresses': 'Fashion',
  'womens-jewellery': 'Fashion',
  'womens-shoes': 'Fashion',
  'womens-watches': 'Fashion',
  'tops': 'Fashion',
  'sunglasses': 'Fashion',
  'furniture': 'Home Goods',
  'home-decoration': 'Home Goods',
  'kitchen-accessories': 'Home Goods',
  'groceries': 'Groceries',
}

const mapProduct = (item) => ({
  id: item.id,
  name: item.title,
  price: item.price,
  category: categoryMapping[item.category] || 'Other',
  imageUrl: item.thumbnail,
  description: item.description,
})

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([DEFAULT_CATEGORY])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [sortOption, setSortOption] = useState(DEFAULT_SORT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const sectionRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const categoryQuery = queryParams.get('category')
    if (categoryQuery) {
      setSelectedCategory(categoryQuery)
    }
  }, [location.search])

  useEffect(() => {
    let isCurrent = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const productsRes = await axios.get(PRODUCT_API_URL)
        const mappedProducts = productsRes.data.products.map(mapProduct)

        if (isCurrent) {
          setProducts(mappedProducts)
          setFilteredProducts(mappedProducts)
          
          const uniqueCategories = Array.from(new Set(mappedProducts.map(p => p.category)))
          // Sort categories so the main 4 are listed first, then 'Other'
          const mainTopics = ['Electronics', 'Fashion', 'Home Goods', 'Groceries']
          const sortedCategories = uniqueCategories.sort((a, b) => {
            const indexA = mainTopics.indexOf(a)
            const indexB = mainTopics.indexOf(b)
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            if (indexA !== -1) return -1
            if (indexB !== -1) return 1
            return a.localeCompare(b)
          })

          setCategories([DEFAULT_CATEGORY, ...sortedCategories])
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

    fetchData()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
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

    setFilteredProducts(updatedProducts)
  }, [products, searchTerm, selectedCategory, sortOption])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory(DEFAULT_CATEGORY)
    setSortOption(DEFAULT_SORT)
  }

  return (
    <section className="catalog-section product-page" id="products" ref={sectionRef}>
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
          <div className="product-grid">
            <ProductList
              products={filteredProducts}
              selectedProductId={null}
              onSelectProduct={() => {}}
            />
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ProductPage
