import Header from './components/Header'
import Banner from './components/Banner'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import './App.css'

const logoModules = import.meta.glob('./assets/logo.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const logoSrc = logoModules['./assets/logo.png'] || ''

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Cart', href: '#cart' },
  { label: 'Login', href: '#login' },
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

function App() {
  return (
    <div className="app-shell">
      <Header title="ShopHub" navItems={navItems} logoSrc={logoSrc} />
      <main>
        <Banner
          title="Welcome to ShopHub"
          subtitle="Modern e-commerce for everyday shopping"
          description="Discover reliable shops, useful categories, and a smoother way to find the products you need."
          buttonText="Shop Now"
        />
        <FeatureSection
          title="Everything customers expect from an online marketplace"
          description="ShopHub focuses on speed, trust, and choice for a simple shopping experience."
          features={features}
        />
      </main>
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
