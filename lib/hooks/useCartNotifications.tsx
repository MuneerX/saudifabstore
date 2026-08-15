import { useCallback } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ShoppingBag, Check, X, AlertCircle } from 'lucide-react';
import styles from './CartToast.module.css';

export const useCartNotifications = () => {
  const showAddToCartSuccess = useCallback((productOrName: any, quantity = 1, size = '', color = '') => {
    let productName = 'Item';
    let productImage: string | null = null;
    let productPrice: number | string | null = null;

    if (typeof productOrName === 'object' && productOrName !== null) {
      productName = productOrName.name || 'Item';
      productImage = productOrName.images?.[0] || productOrName.image || null;
      productPrice = productOrName.price || null;
    } else if (typeof productOrName === 'string') {
      productName = productOrName;
    }

    toast.custom(
      (t) => (
        <div className={styles.toastCard}>
          <div className={styles.toastBody}>
            {/* Close Button (Shifted to Left) */}
            <button
              onClick={() => toast.dismiss(t)}
              className={styles.closeBtn}
              aria-label="Close notification"
              type="button"
            >
              <X size={14} />
            </button>

            {/* Product Thumbnail Wrapper with Check badge floating outside clipped img box */}
            <div className={styles.imgWrapper}>
              <div className={styles.imgBox}>
                {productImage ? (
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className={styles.productImg}
                    sizes="52px"
                  />
                ) : (
                  <div className={styles.fallbackIconBox}>
                    <ShoppingBag size={22} />
                  </div>
                )}
              </div>
              <div className={styles.checkBadge}>
                <Check size={11} strokeWidth={3} />
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.infoCol}>
              <div className={styles.headerTagRow}>
                <span className={styles.pulseDot} />
                <span className={styles.headerTagText}>Added to Cart</span>
              </div>

              <h4 className={styles.productTitle} title={productName}>
                {productName}
              </h4>

              <div className={styles.detailsRow}>
                <span>Qty: <strong className={styles.qtyValue}>{quantity}</strong></span>
                {size && size !== 'One Size' && size !== 'Standard Spec' && (
                  <>
                    <span className={styles.dotDivider}>•</span>
                    <span>{size}</span>
                  </>
                )}
                {productPrice !== null && (
                  <>
                    <span className={styles.dotDivider}>•</span>
                    <span className={styles.priceTag}>
                      €{typeof productPrice === 'number' ? productPrice.toFixed(0) : productPrice}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  }, []);

  const showAddToCartError = useCallback((errorMessage = 'Failed to add item to cart') => {
    toast.custom(
      (t) => (
        <div className={styles.toastErrorCard}>
          <div className={styles.toastBody}>
            <button
              onClick={() => toast.dismiss(t)}
              className={styles.closeBtn}
              aria-label="Close notification"
              type="button"
            >
              <X size={14} />
            </button>

            <div className={styles.errorIconBox}>
              <AlertCircle size={20} />
            </div>

            <div className={styles.infoCol}>
              <div className={styles.headerTagRow}>
                <span className={styles.errorTagText}>Cart Action Failed</span>
              </div>
              <h4 className={styles.productTitle}>Unable to add item</h4>
              <p className={styles.errorMessageText}>{errorMessage}</p>
            </div>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  }, []);

  const showCartUpdateSuccess = useCallback((action: string, productName: string) => {
    toast.custom(
      (t) => (
        <div className={styles.toastUpdateCard}>
          <div className={styles.toastBody}>
            <button
              onClick={() => toast.dismiss(t)}
              className={styles.closeBtn}
              aria-label="Close notification"
              type="button"
            >
              <X size={14} />
            </button>

            <div className={styles.updateIconBox}>
              <Check size={16} />
            </div>

            <div className={styles.infoCol}>
              <div className={styles.headerTagRow}>
                <span className={styles.updateTagText}>Cart Updated</span>
              </div>
              <h4 className={styles.productTitle}>{action} {productName}</h4>
            </div>
          </div>
        </div>
      ),
      { duration: 3000 }
    );
  }, []);

  return {
    showAddToCartSuccess,
    showAddToCartError,
    showCartUpdateSuccess,
  };
};
