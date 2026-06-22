import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import UsersPage from './pages/UsersPage'
import './App.css'

const teamMembers = [
  'Lâm Huy Hào',
  'Phạm Mạnh Cường',
  'Tạ Quang Thành',
  'Khomphakdy Anousone',
]

function App() {
  return (
    <div className="app-shell">
      <Header title="ShopHub" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

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
