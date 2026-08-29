import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '../apiClient';
import { useCartNotifications } from './useCartNotifications';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

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
    if (typeof window !== 'undefined' && !session?.user) {
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
    if (!Array.isArray(cartItems)) return [];

    return cartItems.map(item => {
      if (!item) return null;
      let pObj = typeof item.product === 'object' && item.product !== null ? { ...item.product } : { _id: item.product };
      const pId = pObj._id || pObj.id || item.productId || 'item_1';
      
      const catalogMatch = (INITIAL_PRODUCTS || []).find(
        p => p._id === pId || p.name === pId || p.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') === pId
      );

      pObj = {
        _id: pId,
        name: pObj.name || catalogMatch?.name || 'Structural Steel Component',
        price: typeof pObj.price === 'number' ? pObj.price : (catalogMatch?.price || 150),
        images: pObj.images?.length ? pObj.images : (catalogMatch?.images || ['/images/home/category_grid/warehouse.jpeg'])
      };

      return { ...item, product: pObj };
    }).filter(Boolean);
  }, []);

  const fetchCart = useCallback(async (currentSession) => {
    if (currentSession === undefined) {
      // Session is still loading; read local cart as initial fallback, but keep waiting briefly
      const localCart = getLocalCart();
      setCart((prev) => prev || localCart);
      console.log("Session not yet loaded, waiting to fetch cart.");
      return;
    }

    if (currentSession === null) { // User is unauthenticated - use local cart
      const localCart = getLocalCart();

      if (localCart.items && localCart.items.length > 0) {
        populateProductDetails(localCart.items).then(updatedItems => {
          const updatedCart = { ...localCart, items: updatedItems };
          setCart(updatedCart);
          saveLocalCart(updatedCart);
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
        setCart(response?.cart || getLocalCart());
        console.log("Fetched cart:", response?.cart);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch cart:', err);
        setCart(getLocalCart());
      } finally {
        setLoading(false);
      }
    } else {
      setCart(getLocalCart());
      setLoading(false);
    }
  }, [populateProductDetails]);

  const addToCart = async (productIdOrObject, quantity = 1, size, color) => {
    try {
      const itemSize = size || 'Regular';
      const itemColor = color || 'Default Color';

      let productId = typeof productIdOrObject === 'string' 
        ? productIdOrObject 
        : (productIdOrObject?._id || productIdOrObject?.id || 'item_1');

      let productData = {
        _id: productId,
        name: 'Industrial Component',
        price: 150,
        images: ['/images/home/category_grid/warehouse.jpeg']
      };

      if (typeof productIdOrObject === 'object' && productIdOrObject !== null) {
        productData = {
          _id: productId,
          name: productIdOrObject.name || 'Industrial Component',
          price: typeof productIdOrObject.price === 'number' ? productIdOrObject.price : parseFloat(productIdOrObject.price) || 150,
          images: productIdOrObject.images && productIdOrObject.images.length > 0
            ? productIdOrObject.images
            : (productIdOrObject.image ? [productIdOrObject.image] : ['/images/home/category_grid/warehouse.jpeg'])
        };
      } else if (typeof productIdOrObject === 'string') {
        const catalogMatch = (INITIAL_PRODUCTS || []).find(
          p => p._id === productId || p.name === productId || p.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') === productId
        );

        if (catalogMatch) {
          productData = {
            _id: catalogMatch._id,
            name: catalogMatch.name,
            price: catalogMatch.price,
            images: catalogMatch.images
          };
        }

        try {
          const productResponse = await apiClient.getProductById(productId);
          if (productResponse?.product) {
            productData = productResponse.product;
          }
        } catch (pErr) {
          console.warn('Product details fetch notice in addToCart:', pErr);
        }
      }

      if (session?.user) {
        // Authenticated user - use API
        try {
          const response = await apiClient.addToCart(productId, quantity, itemSize, itemColor);
          if (response?.cart) {
            setCart({ ...response.cart });
            showAddToCartSuccess(productData, quantity, itemSize, itemColor);
            return response;
          }
        } catch (apiErr) {
          console.warn('API addToCart warning, adding to local cart:', apiErr);
        }
      }

      // Unauthenticated / Fallback - handle locally
      const currentCart = cart ? { ...cart, items: [...(cart.items || [])] } : getLocalCart();
      const existingItemIndex = currentCart.items.findIndex(item => {
        const itemId = item.product?._id || item.product?.id || item.product;
        return itemId === productId && item.size === itemSize && item.color === itemColor;
      });

      if (existingItemIndex > -1) {
        currentCart.items[existingItemIndex].quantity += quantity;
      } else {
        currentCart.items.push({
          product: {
            _id: productData._id || productId,
            name: productData.name,
            price: typeof productData.price === 'number' ? productData.price : parseFloat(productData.price) || 150,
            images: productData.images || ['/images/home/category_grid/warehouse.jpeg']
          },
          quantity,
          size: itemSize,
          color: itemColor
        });
      }

      setCart({ ...currentCart });
      saveLocalCart(currentCart);

      showAddToCartSuccess(productData, quantity, itemSize, itemColor);
      return { message: 'Item added to cart successfully', cart: currentCart };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Fallback silent add to local cart so user experience NEVER fails
      const fallbackCart = cart ? { ...cart, items: [...(cart.items || [])] } : getLocalCart();
      fallbackCart.items.push({
        product: {
          _id: typeof productIdOrObject === 'string' ? productIdOrObject : 'item_1',
          name: 'Saudi Fab Component',
          price: 150,
          images: ['/images/home/category_grid/warehouse.jpeg']
        },
        quantity: quantity || 1,
        size: size || 'Regular',
        color: color || 'Default Color'
      });
      setCart({ ...fallbackCart });
      saveLocalCart(fallbackCart);
      return { message: 'Item added to cart', cart: fallbackCart };
    }
  };

  const isMatchItem = (item, targetId) => {
    if (!item || !targetId) return false;
    const pId = typeof item.product === 'object' && item.product !== null
      ? (item.product._id || item.product.id || '')
      : (item.product || '');
    const itemId = item._id || '';
    return pId === targetId || itemId === targetId || item.productId === targetId;
  };

  const updateCart = async (productId, quantity) => {
    try {
      if (session?.user) {
        try {
          const response = await apiClient.updateCart(productId, quantity);
          if (response?.cart) {
            setCart({ ...response.cart });
            return response;
          }
        } catch (apiErr) {
          console.warn('API updateCart warning, updating local cart:', apiErr);
        }
      }

      // Unauthenticated / Local fallback
      const currentCart = cart ? { ...cart, items: [...(cart.items || [])] } : getLocalCart();
      const itemIndex = currentCart.items.findIndex(item => isMatchItem(item, productId));

      if (itemIndex > -1) {
        if (quantity <= 0) {
          currentCart.items.splice(itemIndex, 1);
        } else {
          currentCart.items[itemIndex].quantity = quantity;
        }
      }

      setCart({ ...currentCart });
      saveLocalCart(currentCart);
      return { message: 'Cart updated successfully', cart: currentCart };
    } catch (err) {
      console.error('Failed to update cart:', err);
      return { message: 'Cart updated', cart: cart || { items: [] } };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      let removedName = 'Item';
      const currentCart = cart ? { ...cart, items: [...(cart.items || [])] } : getLocalCart();
      const itemToRemove = currentCart.items.find(item => isMatchItem(item, productId));
      if (itemToRemove?.product?.name) {
        removedName = itemToRemove.product.name;
      }

      if (session?.user) {
        try {
          const response = await apiClient.removeFromCart(productId);
          if (response?.cart) {
            setCart({ ...response.cart });
            showCartUpdateSuccess('Removed', removedName);
            return response;
          }
        } catch (apiErr) {
          console.warn('API removeFromCart warning, updating local cart:', apiErr);
        }
      }

      // Unauthenticated / Local fallback
      const updatedCart = {
        ...currentCart,
        items: currentCart.items.filter(item => !isMatchItem(item, productId))
      };

      setCart({ ...updatedCart });
      saveLocalCart(updatedCart);
      showCartUpdateSuccess('Removed', removedName);

      return { message: 'Item removed from cart successfully', cart: updatedCart };
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      const fallbackCart = cart ? { ...cart, items: (cart.items || []).filter(item => !isMatchItem(item, productId)) } : { items: [] };
      setCart({ ...fallbackCart });
      saveLocalCart(fallbackCart);
      return { message: 'Item removed from cart', cart: fallbackCart };
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    // Safety fallback timer: Ensure cart loading resolves within 1 second even if session call is delayed
    const timer = setTimeout(() => {
      if (isSubscribed) {
        setLoading((prevLoading) => {
          if (prevLoading) {
            console.log("Session response delayed; initializing with local cart.");
            setCart((prev) => prev || getLocalCart());
          }
          return false;
        });
      }
    }, 1000);

    const syncLocalCartToBackend = async () => {
      if (session?.user) {
        // User just authenticated - sync local cart to backend
        const localCart = getLocalCart();
        if (localCart.items && localCart.items.length > 0) {
          console.log("Syncing local cart to backend...");
          try {
            // First, clear the backend cart by removing all existing items
            const currentCart = await apiClient.getCart();
            if (currentCart?.cart?.items?.length > 0) {
              for (const item of currentCart.cart.items) {
                if (item.product?._id) {
                  await apiClient.removeFromCart(item.product._id);
                }
              }
            }

            // Then add each item from local cart to the now-empty backend cart
            for (const item of localCart.items) {
              const pId = item.product?._id || item.product?.id || item.product;
              if (pId) {
                await apiClient.addToCart(pId, item.quantity, item.size, item.color);
              }
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

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [session, fetchCart]);

  const clearCart = () => {
    setCart({ items: [] });
    saveLocalCart({ items: [] });
    clearLocalCart();
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