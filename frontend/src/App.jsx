import { useState } from 'react'
import Header from './components/Header'
import Banner from './components/Banner'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import ProductPage from './pages/ProductPage'
import UsersPage from './pages/UsersPage'
import './App.css'

const logoModules = import.meta.glob('./assets/logo.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const logoSrc = logoModules['./assets/logo.png'] || ''

const navItems = [
  { label: 'Home', view: 'home' },
  { label: 'Products', view: 'home' },
  { label: 'Users', view: 'users' },
  { label: 'Cart', view: 'cart' },
  { label: 'Login', view: 'login' },
]

const features = [
  {
    id: '01',
    title: 'Fast Delivery',
    description: 'Orders move quickly from trusted shops to customers with clear delivery updates.',
  },
  {
    id: '02',
    title: 'Secure Payments',
    description: 'ShopHub keeps checkout simple and protects every transaction with safe payment flows.',
  },
  {
    id: '03',
    title: 'Multiple Shops and Categories',
    description: 'Customers can browse products from many shops and categories in one convenient place.',
  },
]

const teamMembers = [
  'Lâm Huy Hào',
  'Phạm Mạnh Cường',
  'Tạ Quang Thành',
  'Khomphakdy Anousone',
]

const PlaceholderView = ({ title, description }) => {
  return (
    <main>
      <section className="placeholder-section">
        <p className="section-kicker">Coming Soon</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [activeNavLabel, setActiveNavLabel] = useState('Home')

  const activeNavItems = navItems.map((item) => ({
    ...item,
    active: item.label === activeNavLabel,
  }))

  const navigateTo = (item) => {
    setCurrentView(item.view)
    setActiveNavLabel(item.label)

    if (item.label === 'Products') {
      setTimeout(() => {
        const productsSection = document.getElementById('products')
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const showHomeView = currentView === 'home'
  const showUsersView = currentView === 'users'

  return (
    <div className="app-shell">
      <Header
        title="ShopHub"
        navItems={activeNavItems}
        logoSrc={logoSrc}
        onBrandClick={() => navigateTo(navItems[0])}
        onNavigate={navigateTo}
      />

      {showHomeView ? (
        <main>
          <Banner
            title="Welcome to ShopHub"
            subtitle="Modern e-commerce for everyday shopping"
            description="Discover reliable shops, useful categories, and a smoother way to find the products you need."
            buttonText="Shop Now"
          />
          <ProductPage />
          <FeatureSection
            title="Everything customers expect from an online marketplace"
            description="ShopHub focuses on speed, trust, and choice for a simple shopping experience."
            features={features}
          />
        </main>
      ) : null}

      {showUsersView ? (
        <main>
          <UsersPage />
        </main>
      ) : null}

      {currentView === 'cart' ? (
        <PlaceholderView
          title="Cart"
          description="The shopping cart placeholder is ready for a later session."
        />
      ) : null}

      {currentView === 'login' ? (
        <PlaceholderView
          title="Login"
          description="The login placeholder is ready for a later session."
        />
      ) : null}

      <Footer
        teamMembers={teamMembers}
        classInfo="22BITV01"
        studentYear="Year 4"
        courseName="Chuyên đề tốt nghiệp Công nghệ phần mềm 2"
        year="2026"
      />
    </div>
  )
}

export default App
