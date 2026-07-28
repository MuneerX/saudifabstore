import { useState } from 'react';
import apiClient from '../apiClient';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOrders();
      setOrders(response.orders);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch orders:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await apiClient.createOrder(orderData);
      // Add the new order to the orders list
      setOrders(prevOrders => [response.order, ...prevOrders]);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id) => {
    try {
      const response = await apiClient.getOrderById(id);
      return response.order;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch order:', err);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
  };
};