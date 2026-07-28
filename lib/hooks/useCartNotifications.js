import { useCallback } from 'react';
import { toast } from 'sonner';

export const useCartNotifications = () => {
  const showAddToCartSuccess = useCallback((productName, quantity = 1) => {
    toast.success(
      <div className="p-3">
        <div className="font-semibold text-sm text-black">
          Added to Cart!
        </div>
        <div className="text-xs text-black truncate mt-1">
          {quantity > 1 ? `${quantity}x ${productName}` : productName}
        </div>
      </div>,
      {
        duration: 4000,
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        className: 'cart-toast',
      }
    );
  }, []);

  const showAddToCartError = useCallback((errorMessage = 'Failed to add item to cart') => {
    toast.error(
      <div className="p-3">
        <div className="font-semibold text-sm text-black">
          Add to Cart Failed
        </div>
        <div className="text-xs text-black mt-1">
          {errorMessage}
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
      }
    );
  }, []);

  const showCartUpdateSuccess = useCallback((action, productName) => {
    toast.success(
      <div className="p-3">
        <div className="font-semibold text-sm text-black">
          Cart Updated
        </div>
        <div className="text-xs text-black mt-1">
          {action} {productName}
        </div>
      </div>,
      {
        duration: 3000,
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
      }
    );
  }, []);

  return {
    showAddToCartSuccess,
    showAddToCartError,
    showCartUpdateSuccess,
  };
};