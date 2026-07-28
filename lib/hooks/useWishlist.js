import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getWishlist();
      setWishlist(response.wishlist);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await apiClient.addToWishlist(productId);
      setWishlist(response.wishlist);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to add to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await apiClient.removeFromWishlist(productId);
      setWishlist(response.wishlist);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove from wishlist:', err);
      throw err;
    }
 };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};