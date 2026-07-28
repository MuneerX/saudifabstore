import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '../apiClient';
import { useCartNotifications } from './useCartNotifications';

const CART_STORAGE_KEY = 'guest_cart';

export const useCart = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAddToCartSuccess, showAddToCartError, showCartUpdateSuccess } = useCartNotifications();

  // Helper function to get cart from localStorage
  const getLocalCart = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { items: [] };
    }
    return { items: [] };
  };

  // Helper function to save cart to localStorage
  const saveLocalCart = (cartData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    }
  };

  // Helper function to clear local cart
  const clearLocalCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  // Helper function to populate product details for cart items (optimized)
  const populateProductDetails = useCallback(async (cartItems) => {
    const itemsNeedingDetails = cartItems.filter(item =>
      !item.product.name || !item.product.price || !item.product.images?.length
    );

    if (itemsNeedingDetails.length === 0) {
      return cartItems; // All items already have details
    }

    // Batch fetch product details to reduce API calls
    const updatedItems = [...cartItems];

    for (const item of itemsNeedingDetails) {
      try {
        const productResponse = await apiClient.getProductById(item.product._id);
        const productData = productResponse.product;

        const itemIndex = updatedItems.findIndex(cartItem =>
          cartItem.product._id === item.product._id
        );

        if (itemIndex > -1) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            product: {
              _id: productData._id,
              name: productData.name,
              price: productData.price,
              images: productData.images
            }
          };
        }
      } catch (err) {
        console.error(`Failed to fetch product details for ${item.product._id}:`, err);
        // Keep the item as is if we can't fetch details
      }
    }

    return updatedItems;
  }, []);

  const fetchCart = useCallback(async (currentSession) => {
    if (currentSession === undefined) { // session is undefined initially, so wait for it to be null or an object
      console.log("Session not yet loaded, waiting to fetch cart.");
      return;
    }

    if (currentSession === null) { // User is unauthenticated - use local cart
      const localCart = getLocalCart();

      // Populate product details for any items that might be missing them
      if (localCart.items.length > 0) {
        populateProductDetails(localCart.items).then(updatedItems => {
          const updatedCart = { ...localCart, items: updatedItems };
          setCart(updatedCart);
          saveLocalCart(updatedCart); // Save the updated cart with populated details
          setLoading(false);
          console.log("User unauthenticated, using local cart with populated details:", updatedCart);
        }).catch(err => {
          console.error("Failed to populate product details:", err);
          setCart(localCart);
          setLoading(false);
        });
      } else {
        setCart(localCart);
        setLoading(false);
        console.log("User unauthenticated, using local cart:", localCart);
      }
      return;
    }

    if (currentSession?.user) { // User is authenticated
      console.log("Session authenticated, fetching cart.");
      try {
        setLoading(true);
        const response = await apiClient.getCart();
        setCart(response.cart);
        console.log("Fetched cart:", response.cart);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const addToCart = async (productId, quantity, size, color) => {
    try {
      // Ensure size and color are not undefined
      const itemSize = size || 'One Size';
      const itemColor = color || 'Default Color';

      if (session?.user) {
        // Authenticated user - use API
        const response = await apiClient.addToCart(productId, quantity, itemSize, itemColor);
        setCart(response.cart);

        // Show success notification
        const productResponse = await apiClient.getProductById(productId);
        showAddToCartSuccess(productResponse.product.name, quantity);

        return response;
      } else {
        // Unauthenticated user - handle locally
        // First, fetch product details to populate cart item
        const productResponse = await apiClient.getProductById(productId);
        const productData = productResponse.product;

        const currentCart = cart || getLocalCart();
        const existingItemIndex = currentCart.items.findIndex(
          item => item.product._id === productId && item.size === itemSize && item.color === itemColor
        );

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          currentCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart with full product details
          currentCart.items.push({
            product: {
              _id: productData._id,
              name: productData.name,
              price: productData.price,
              images: productData.images
            },
            quantity,
            size: itemSize,
            color: itemColor
          });
        }

        setCart(currentCart);
        saveLocalCart(currentCart);

        // Show success notification
        showAddToCartSuccess(productData.name, quantity);

        return { message: 'Item added to cart successfully', cart: currentCart };
      }
    } catch (err) {
      // Show error notification
      showAddToCartError(err.message || 'Failed to add item to cart');

      setError(err.message);
      console.error('Failed to add to cart:', err);
      throw err;
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      if (session?.user) {
        // Authenticated user - use API
        const response = await apiClient.updateCart(productId, quantity);
        setCart(response.cart);

        // Show update notification
        if (quantity <= 0) {
          const productResponse = await apiClient.getProductById(productId);
          showCartUpdateSuccess('Removed', productResponse.product.name);
        }

        return response;
      } else {
        // Unauthenticated user - handle locally
        const currentCart = cart || getLocalCart();
        const itemIndex = currentCart.items.findIndex(item => item.product._id === productId);

        if (itemIndex > -1) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            const removedItem = currentCart.items[itemIndex];
            currentCart.items.splice(itemIndex, 1);
            showCartUpdateSuccess('Removed', removedItem.product.name);
          } else {
            currentCart.items[itemIndex].quantity = quantity;
            showCartUpdateSuccess('Updated', currentCart.items[itemIndex].product.name);
          }
        }

        setCart(currentCart);
        saveLocalCart(currentCart);
        return { message: 'Cart updated successfully', cart: currentCart };
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to update cart:', err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      let removedProductName = '';

      if (session?.user) {
        // Get product name before removing for notification
        const currentCart = cart || { items: [] };
        const itemToRemove = currentCart.items.find(item => item.product._id === productId);
        removedProductName = itemToRemove?.product?.name || 'Item';

        // Authenticated user - use API
        const response = await apiClient.removeFromCart(productId);

        // Force state update with a new object reference to ensure Android compatibility
        setCart(prevCart => {
          // Create a completely new cart object to ensure React detects the change
          const newCart = { ...response.cart };
          return newCart;
        });

        // Small delay to ensure Android processes the state update
        setTimeout(() => {
          showCartUpdateSuccess('Removed', removedProductName);
        }, 50);

        return response;
      } else {
        // Unauthenticated user - handle locally
        const currentCart = cart || getLocalCart();
        const itemToRemove = currentCart.items.find(item => item.product._id === productId);
        removedProductName = itemToRemove?.product?.name || 'Item';

        // Create a new cart object with filtered items to ensure state update
        const updatedCart = {
          ...currentCart,
          items: currentCart.items.filter(item => item.product._id !== productId)
        };

        setCart(updatedCart);
        saveLocalCart(updatedCart);

        // Small delay to ensure Android processes the state update
        setTimeout(() => {
          showCartUpdateSuccess('Removed', removedProductName);
        }, 50);

        return { message: 'Item removed from cart successfully', cart: updatedCart };
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove from cart:', err);
      throw err;
    }
  };

  useEffect(() => {
    const syncLocalCartToBackend = async () => {
      if (session?.user) {
        // User just authenticated - sync local cart to backend
        const localCart = getLocalCart();
        if (localCart.items.length > 0) {
          console.log("Syncing local cart to backend...");
          try {
            // First, clear the backend cart by removing all existing items
            const currentCart = await apiClient.getCart();
            if (currentCart.cart && currentCart.cart.items.length > 0) {
              for (const item of currentCart.cart.items) {
                await apiClient.removeFromCart(item.product._id);
              }
            }

            // Then add each item from local cart to the now-empty backend cart
            for (const item of localCart.items) {
              await apiClient.addToCart(item.product._id, item.quantity, item.size, item.color);
            }

            // Clear local cart after successful sync
            clearLocalCart();
            console.log("Local cart synced to backend successfully");
          } catch (err) {
            console.error("Failed to sync local cart to backend:", err);
          }
        }
      }
    };

    fetchCart(session);
    syncLocalCartToBackend();
  }, [session?.user?.id]); // Only re-run when user ID changes, not entire session object

  const clearCart = () => {
    if (session?.user) {
      // For authenticated users, the cart is cleared by the backend
      // Just refresh to get the empty cart
      fetchCart(session);
    } else {
      // For unauthenticated users, clear local cart
      setCart({ items: [] });
      saveLocalCart({ items: [] });
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
  };
};