import { useState, useEffect, useCallback } from 'react';
import apiClient from '../apiClient';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from multiple endpoints safely
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        apiClient.request('/admin/users?limit=1000').catch(() => ({ users: [] })),
        apiClient.request('/products?limit=1000').catch(() => ({ products: [] })),
        apiClient.request('/orders?limit=1000').catch(() => ({ orders: [] }))
      ]);

      const users = usersRes.users || [];
      const products = productsRes.products || [];
      const orders = ordersRes.orders || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalCustomers = users.filter(user => user.role !== 'admin').length;

      // Mock percentage changes (in a real app, you'd compare with previous period)
      const revenueChange = 20.1;
      const ordersChange = 180.1;
      const productsChange = 19;
      const customersChange = 201;

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueChange,
        ordersChange,
        productsChange,
        customersChange
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useRecentOrders = (limit = 5) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.request(`/admin/orders?limit=${limit}&sort=-createdAt`);
      const ordersData = response.orders || [];

      // Format orders for display
      const formattedOrders = ordersData.map(order => ({
        id: order._id,
        customer: order.user?.name || order.shippingAddress?.name || order.user?.email || order.shippingAddress?.email || order.shippingAddress?.phone || 'Valued Customer',
        date: new Date(order.createdAt).toLocaleDateString(),
        amount: order.totalPrice?.toFixed(2) || '0.00',
        status: order.isPaid ? (order.isDelivered ? 'Completed' : 'Paid') : 'Pending'
      }));

      setOrders(formattedOrders);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch recent orders:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};


export const useRevenueData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock revenue data for the last 6 months
      // In a real app, you'd aggregate this from orders
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockData = months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 5000) + 3000
      }));

      setData(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return { data, loading, error, refetch: fetchRevenueData };
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchFilters.search) params.append('search', searchFilters.search);
      if (searchFilters.category && searchFilters.category !== 'All') params.append('category', searchFilters.category);
      if (searchFilters.status && searchFilters.status !== 'All') {
        if (searchFilters.status === 'Active') {
          params.append('minStock', '1');
        } else if (searchFilters.status === 'Out of Stock') {
          params.append('maxStock', '0');
        }
      }
      params.append('limit', '100'); // Get all products for admin view

      const queryString = params.toString();
      const url = `/admin/products${queryString ? `?${queryString}` : ''}`;

      let productsData = [];
      let totalCount = 0;
      try {
        const response = await apiClient.request(url);
        productsData = response.products || [];
        totalCount = response.total || productsData.length;
      } catch (adminErr) {
        console.warn('Admin products fetch fallback to public catalog endpoint:', adminErr);
        const fallbackRes = await fetch('/api/products?limit=100');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          productsData = fallbackData.products || [];
          totalCount = fallbackData.total || productsData.length;
        }
      }

      // Format products for display
      const formattedProducts = productsData.map(product => ({
        id: product._id || product.id,
        name: product.name,
        category: product.category || 'Uncategorized',
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
        stock: typeof product.stock === 'number' ? product.stock : parseInt(product.stock) || 0,
        image: product.images?.[0] || product.image || '/images/home/category_grid/warehouse.jpeg',
        status: (product.stock > 0 || product.stock === undefined) ? 'Active' : 'Out of Stock'
      }));

      setProducts(formattedProducts);
      setTotal(totalCount || formattedProducts.length);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = async (productId) => {
    try {
      await apiClient.request(`/admin/products/${productId}`, {
        method: 'DELETE'
      });

      // Remove from local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      setTotal(prev => prev - 1);

      return { success: true };
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    deleteProduct
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchFilters.search) params.append('search', searchFilters.search);
      if (searchFilters.status && searchFilters.status !== 'All') params.append('status', searchFilters.status.toLowerCase());
      params.append('limit', '100'); // Get all orders for admin view

      const queryString = params.toString();
      const url = `/admin/orders${queryString ? `?${queryString}` : ''}`;

      let ordersData = [];
      let totalCount = 0;
      try {
        const response = await apiClient.request(url);
        ordersData = response.orders || [];
        totalCount = response.total || ordersData.length;
      } catch (orderErr) {
        console.warn('Admin orders fetch warning:', orderErr);
      }

      // Format orders for display
      const formattedOrders = ordersData.map(order => {
        // Determine status with proper fallback for existing orders
        let status = 'pending'; // default
        if (order.shippingStatus) {
          status = order.shippingStatus;
        } else {
          // Fallback for orders created before shippingStatus field
          if (order.isPaid) {
            status = order.isDelivered ? 'delivered' : 'shipped';
          } else {
            status = 'pending';
          }
        }

        return {
          id: order._id,
          customer: order.user?.name || order.shippingAddress?.name || 'Customer',
          email: order.user?.email || order.shippingAddress?.email || 'No email',
          phone: order.shippingAddress?.phone || order.user?.phone || 'No phone',
          date: new Date(order.createdAt).toLocaleDateString(),
          amount: order.totalPrice || 0,
          status: status,
          items: order.orderItems?.length || 0
        };
      });

      setOrders(formattedOrders);
      setTotal(totalCount || formattedOrders.length);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId, isDelivered, isPaid) => {
    try {
      await apiClient.request('/admin/orders', {
        method: 'PUT',
        body: JSON.stringify({ orderId, isDelivered, isPaid })
      });

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: isPaid ? (isDelivered ? 'Completed' : 'Paid') : 'Pending'
            }
          : order
      ));

      return { success: true };
    } catch (err) {
      console.error('Failed to update order status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    total,
    refetch: fetchOrders,
    updateOrderStatus
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState([{
    id: '',
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    orders: 0,
    totalSpent: 0,
    status: ''
  }].slice(0, 0)); // Initialize with empty array but proper typing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchFilters.search) params.append('search', searchFilters.search);
      if (searchFilters.status && searchFilters.status !== 'All') params.append('status', searchFilters.status.toLowerCase());
      params.append('limit', '100'); // Get all customers for admin view

      const queryString = params.toString();
      const url = `/admin/users${queryString ? `?${queryString}` : ''}`;

      let customersData = [];
      let totalCount = 0;
      try {
        const response = await apiClient.request(url);
        customersData = response.users || [];
        totalCount = response.total || customersData.length;
      } catch (custErr) {
        console.warn('Admin users fetch warning:', custErr);
      }

      // Get all orders to calculate real customer statistics
      let allOrders = [];
      try {
        const ordersResponse = await apiClient.request('/admin/orders?limit=1000');
        allOrders = ordersResponse.orders || [];
      } catch (orderErr) {
        console.warn('Admin orders fetch warning in useAdminCustomers:', orderErr);
      }

      // Calculate order statistics for each customer
      const customerStats = {};
      const orderCustomerMap = {}; // Map customer Email to stats and latest info

      allOrders.forEach(order => {
        const userId = typeof order.user === 'object' ? order.user?._id?.toString() : order.user?.toString();
        const userEmail = order.user?.email || order.shippingAddress?.email;
        const userName = order.user?.name || order.shippingAddress?.name || 'Customer';
        const userPhone = order.shippingAddress?.phone || order.user?.phone || '';

        if (userId) {
          if (!customerStats[userId]) customerStats[userId] = { orderCount: 0, totalSpent: 0 };
          customerStats[userId].orderCount += 1;
          customerStats[userId].totalSpent += order.totalPrice || 0;
        }

        if (userEmail) {
          const emailKey = userEmail.toLowerCase();
          if (!orderCustomerMap[emailKey]) {
            orderCustomerMap[emailKey] = {
              id: userId || `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              name: userName,
              email: userEmail,
              phone: userPhone,
              joinDate: new Date(order.createdAt).toLocaleDateString(),
              orderCount: 0,
              totalSpent: 0,
            };
          }
          orderCustomerMap[emailKey].orderCount += 1;
          orderCustomerMap[emailKey].totalSpent += order.totalPrice || 0;
        }
      });

      // Format DB users (filtering out admin users)
      const existingEmails = new Set();
      const formattedCustomers = customersData
        .filter(user => user.role !== 'admin')
        .map(user => {
          const emailKey = user.email ? user.email.toLowerCase() : '';
          if (emailKey) existingEmails.add(emailKey);
          const stats = customerStats[user._id] || orderCustomerMap[emailKey] || { orderCount: 0, totalSpent: 0 };

          return {
            id: user._id,
            name: user.name || orderCustomerMap[emailKey]?.name || 'Customer',
            email: user.email || 'No email',
            phone: user.phone || orderCustomerMap[emailKey]?.phone || 'No phone',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            orders: stats.orderCount || stats.orders || 0,
            totalSpent: stats.totalSpent || 0,
            status: user.isActive !== false ? 'Active' : 'Inactive',
            referralSource: user.referralSource || 'Direct'
          };
        });

      // Also include any customer from orders who might not be in customersData
      Object.keys(orderCustomerMap).forEach(emailKey => {
        if (!existingEmails.has(emailKey) && emailKey !== 'admin@saudifabstore.com' && emailKey !== 'admin@example.com') {
          const cData = orderCustomerMap[emailKey];
          formattedCustomers.push({
            id: cData.id,
            name: cData.name,
            email: cData.email,
            phone: cData.phone || 'No phone',
            joinDate: cData.joinDate,
            orders: cData.orderCount,
            totalSpent: cData.totalSpent,
            status: 'Active',
            referralSource: cData.referralSource || 'Direct'
          });
        }
      });

      setCustomers(formattedCustomers);
      setTotal(totalCount || formattedCustomers.length);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch admin customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomerStatus = async (customerId, isActive) => {
    try {
      await apiClient.request('/admin/users', {
        method: 'PUT',
        body: JSON.stringify({ userId: customerId, isActive })
      });

      // Update local state
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              status: isActive ? 'Active' : 'Inactive'
            }
          : customer
      ));

      return { success: true };
    } catch (err) {
      console.error('Failed to update customer status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    total,
    refetch: fetchCustomers,
    updateCustomerStatus
  };
};