import { useState, useEffect, useCallback } from 'react';
import apiClient from '../apiClient';

export const usePopularProducts = (limit = 5) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, ordersRes] = await Promise.all([
        apiClient.request(`/products?limit=1000`),
        apiClient.request('/orders?limit=1000')
      ]);

      const productsData = productsRes.products || [];
      const ordersData = ordersRes.orders || [];

      const salesData = {};

      ordersData.forEach(order => {
        order.orderItems.forEach(item => {
          if (item.product && item.product._id) {
            const productId = item.product._id.toString();
            const product = productsData.find(p => p._id && p._id.toString() === productId);
            if (product) {
              if (salesData[productId]) {
                salesData[productId].orders += 1;
                salesData[productId].revenue += item.quantity * product.price;
              } else {
                salesData[productId] = {
                  orders: 1,
                  revenue: item.quantity * product.price,
                };
              }
            }
          }
        });
      });

      const popularProducts = productsData.map(product => ({
        ...product,
        orders: salesData[product._id] ? salesData[product._id].orders : 0,
        revenue: salesData[product._id] ? salesData[product._id].revenue : 0,
      }));

      popularProducts.sort((a, b) => b.orders - a.orders);

      const formattedProducts = popularProducts.slice(0, limit).map(product => ({
        id: product._id,
        name: product.name,
        sales: product.orders,
        revenue: product.revenue.toFixed(2),
        images: product.images, // Include images for display
        price: product.price,
        discountPrice: product.discountPrice,
        rating: product.rating,
      }));
      setProducts(formattedProducts);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch popular products:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};