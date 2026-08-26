// API Client for making requests to backend endpoints
class ApiClient {
  constructor() {
    this.baseURL = '/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data = {};
      
      if (text && text.trim().length > 0) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn('API response is not valid JSON:', text);
        }
      }

      if (!response.ok) {
        const fallbackMsg = response.statusText || `Request failed with status ${response.status}`;
        const errorMsg = data.error || data.message || fallbackMsg;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      console.warn(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async getSession() {
    return this.request('/session');
  }

  // User Profile APIs
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product APIs
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/products?${searchParams}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // Cart APIs
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity, size, color) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, size, color }),
    });
  }

  async updateCart(productId, quantity) {
    return this.request('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request('/cart', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  // Wishlist APIs
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request('/wishlist', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  // Order APIs
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  // Admin APIs
  async createAdminProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getAdminProducts(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/products?${searchParams}`);
  }

  async updateAdminProduct(productId, productData) {
    return this.request('/admin/products', {
      method: 'PUT',
      body: JSON.stringify({ productId, ...productData }),
    });
  }

  async deleteAdminProduct(productId) {
    return this.request('/admin/products', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }
}

export default new ApiClient();