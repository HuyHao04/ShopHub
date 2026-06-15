const API_BASE_URL = 'https://fakestoreapi.com'

const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`FakeStoreAPI request failed with status ${response.status}.`)
  }

  return response.json()
}

export const getProducts = ({ signal } = {}) => {
  return fetchJson('/products', { signal })
}

export const getProductById = (id, { signal } = {}) => {
  return fetchJson(`/products/${id}`, { signal })
}

export const getUsers = ({ signal } = {}) => {
  return fetchJson('/users', { signal })
}

export const getUserById = (id, { signal } = {}) => {
  return fetchJson(`/users/${id}`, { signal })
}
