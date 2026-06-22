import Banner from '../components/Banner'
import FeatureSection from '../components/FeatureSection'

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

const HomePage = () => {
  return (
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
  )
}

export default HomePage
