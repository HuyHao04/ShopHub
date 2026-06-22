import { useState } from 'react'
import { Link } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const initialCartItems = [
  {
    id: 1,
    name: 'Essence Mascara Lash Princess',
    price: 9.99,
    quantity: 2,
    image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
  },
  {
    id: 2,
    name: 'Eyeshadow Palette with Mirror',
    price: 19.99,
    quantity: 1,
    image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
  },
  {
    id: 3,
    name: 'Powder Canister',
    price: 14.99,
    quantity: 3,
    image: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
  },
]

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="section-heading">
          <p className="section-kicker">Your Cart</p>
          <h1>Shopping Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products yet.</p>
            <Link className="primary-button" to="/products">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="cart-product-cell">
                        <img
                          className="cart-product-image"
                          src={item.image}
                          alt={item.name}
                        />
                        <span className="cart-product-name">{item.name}</span>
                      </td>
                      <td>{currencyFormatter.format(item.price)}</td>
                      <td>
                        <div className="cart-quantity-controls">
                          <button
                            className="qty-btn"
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="cart-subtotal">
                        {currencyFormatter.format(item.price * item.quantity)}
                      </td>
                      <td>
                        <button
                          className="cart-remove-btn"
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <strong>{currencyFormatter.format(totalPrice)}</strong>
              </div>
              <div className="cart-actions">
                <Link className="secondary-button" to="/products">
                  Continue Shopping
                </Link>
                <Link className="primary-button" to="/login">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default CartPage
