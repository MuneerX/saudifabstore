import { useState, useEffect, useCallback } from 'react';
import apiClient from '../apiClient';
 
export const useProducts = (autoFetch = false) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
 
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts(params);
      setProducts(response.products || []);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [apiClient, setProducts, setLoading, setError]);
 
  const getProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await apiClient.getProductById(id);
      return response.product;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch product:', err);
      return null; // Return null on error
    } finally {
      setLoading(false);
    }
  }, [apiClient, setLoading, setError]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch]); // Removed fetchProducts from dependencies since it's useCallback

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
  };
};