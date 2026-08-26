export interface BadgeConfig {
  text: string;
  styleClass: string;
}

export interface CatalogStats {
  maxOrders: number;
  avgOrders: number;
  bestsellerThreshold: number;
  popularThreshold: number;
}

export interface ProductItemInput {
  _id?: string;
  name?: string;
  stock?: number;
  price?: number;
  discountPrice?: number;
  orderCount?: number;
  numReviews?: number;
  isFeatured?: boolean;
  createdAt?: string | Date;
  badge?: string;
}

/**
 * Calculates statistical catalog metrics dynamically based on relative order distribution.
 */
export function calculateCatalogStats(products: ProductItemInput[]): CatalogStats {
  if (!products || products.length === 0) {
    return { maxOrders: 0, avgOrders: 0, bestsellerThreshold: 3, popularThreshold: 1 };
  }

  const orderCounts = products.map(p => typeof p.orderCount === 'number' ? p.orderCount : 0);
  const maxOrders = Math.max(...orderCounts, 0);
  
  const activeOrderCounts = orderCounts.filter(c => c > 0);
  const sumOrders = activeOrderCounts.reduce((acc, val) => acc + val, 0);
  const avgOrders = activeOrderCounts.length > 0 ? sumOrders / activeOrderCounts.length : 0;

  // Relative Threshold Calculations:
  // - BESTSELLER: Must be in top tier (at least 75% of maxOrders or 1.5x average orders, min 2)
  // - POPULAR PICK: Must be at or above average order count (min 1, but less than Bestseller threshold)
  let bestsellerThreshold = Math.max(2, Math.ceil(maxOrders * 0.75), Math.ceil(avgOrders * 1.5));
  let popularThreshold = Math.max(1, Math.floor(avgOrders));

  // Ensure bestsellerThreshold is strictly greater than popularThreshold if there's variance
  if (bestsellerThreshold <= popularThreshold && maxOrders > 1) {
    bestsellerThreshold = popularThreshold + 1;
  }

  return {
    maxOrders,
    avgOrders,
    bestsellerThreshold,
    popularThreshold
  };
}

/**
 * Intelligently computes a badge relative to catalog performance metrics or single product data.
 */
export function getDynamicBadge(
  product: ProductItemInput,
  styles: Record<string, string>,
  catalogStats?: CatalogStats
): BadgeConfig | null {
  const stock = typeof product.stock === 'number' ? product.stock : 10;
  const orderCount = typeof product.orderCount === 'number' ? product.orderCount : 0;
  const price = typeof product.price === 'number' ? product.price : 0;
  const discountPrice = typeof product.discountPrice === 'number' ? product.discountPrice : undefined;

  // 1. Out of stock (Highest Priority)
  if (stock === 0) {
    return { text: "OUT OF STOCK", styleClass: styles.badgeLimited || "" };
  }

  // 2. Low Stock Scarcity (Stock <= 5)
  if (stock > 0 && stock <= 5) {
    return { text: "LIMITED STOCK", styleClass: styles.badgeLimited || "" };
  }

  // 3. Price Discount: BEST DEAL / SAVE XX%
  if (discountPrice && discountPrice < price && price > 0) {
    const savingsPercent = Math.round(((price - discountPrice) / price) * 100);
    if (savingsPercent >= 5) {
      return { text: `SAVE ${savingsPercent}%`, styleClass: styles.badgeBestSeller || "" };
    }
    return { text: "BEST DEAL", styleClass: styles.badgeBestSeller || "" };
  }

  // Determine statistical thresholds relative to catalog average if provided
  const bestsellerMin = catalogStats ? catalogStats.bestsellerThreshold : 3;
  const popularMin = catalogStats ? catalogStats.popularThreshold : 1;

  // 4. Relative Bestseller (Top tier sales volume relative to average customer orders)
  if (orderCount >= bestsellerMin && orderCount > 0) {
    return { text: "BEST SELLER", styleClass: styles.badgeBestSeller || "" };
  }

  // 5. Relative Popular Pick (Above-average sales volume, but below top Bestseller tier)
  if (orderCount >= popularMin && orderCount < bestsellerMin && orderCount > 0) {
    return { text: "POPULAR PICK", styleClass: styles.badgeBestSeller || "" };
  }

  // 6. New Arrival (Only for newly created products added via Admin form in last 7 days)
  if (product.createdAt) {
    const isPreSeeded = product._id && /^prod-\d+$/.test(String(product._id));
    if (!isPreSeeded) {
      const createdDate = new Date(product.createdAt).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (createdDate > sevenDaysAgo) {
        return { text: "NEW", styleClass: styles.badgeNew || "" };
      }
    }
  }

  // Standard item without high relative sales or discount: No badge (clean uncluttered card)
  return null;
}

/**
 * Convenience helper to compute catalog-wide relative badges in a single pass.
 */
export function getCatalogBadgeMap(
  products: ProductItemInput[],
  styles: Record<string, string>
): Map<string, BadgeConfig | null> {
  const stats = calculateCatalogStats(products);
  const map = new Map<string, BadgeConfig | null>();

  products.forEach(product => {
    const key = product._id ? String(product._id) : (product.name || '');
    map.set(key, getDynamicBadge(product, styles, stats));
  });

  return map;
}

/**
 * Sorts products strictly for "New Arrivals & Latest Products":
 * 1. Admin added items / newest creation timestamp (createdAt) descending
 * 2. In stock availability
 */
export function sortProductsByNewAndLatest<T extends ProductItemInput>(products: T[]): T[] {
  if (!products || products.length === 0) return [];

  return [...products].sort((a, b) => {
    const aIsPreSeeded = a._id && /^prod-\d+$/.test(String(a._id));
    const bIsPreSeeded = b._id && /^prod-\d+$/.test(String(b._id));
    if (aIsPreSeeded !== bIsPreSeeded) return aIsPreSeeded ? 1 : -1;

    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    if (aTime !== bTime) return bTime - aTime;

    const aStock = (typeof a.stock === 'number' ? a.stock : 1) > 0 ? 1 : 0;
    const bStock = (typeof b.stock === 'number' ? b.stock : 1) > 0 ? 1 : 0;
    return bStock - aStock;
  });
}

/**
 * Sorts products strictly for "Popular Bestsellers":
 * 1. In stock availability
 * 2. High order sales volume (orderCount)
 * 3. High percentage discount deal savings
 */
export function sortProductsByPopularBestsellers<T extends ProductItemInput>(products: T[]): T[] {
  if (!products || products.length === 0) return [];

  return [...products].sort((a, b) => {
    const aStock = (typeof a.stock === 'number' ? a.stock : 1) > 0 ? 1 : 0;
    const bStock = (typeof b.stock === 'number' ? b.stock : 1) > 0 ? 1 : 0;
    if (aStock !== bStock) return bStock - aStock;

    const aOrders = typeof a.orderCount === 'number' ? a.orderCount : 0;
    const bOrders = typeof b.orderCount === 'number' ? b.orderCount : 0;
    if (aOrders !== bOrders) return bOrders - aOrders;

    const aSavings = (a.discountPrice && a.price && a.price > 0) ? ((a.price - a.discountPrice) / a.price) : 0;
    const bSavings = (b.discountPrice && b.price && b.price > 0) ? ((b.price - b.discountPrice) / b.price) : 0;
    return bSavings - aSavings;
  });
}

/**
 * Arranges products by potential performance:
 * 1. In-stock availability
 * 2. High order sales volume
 * 3. Active percentage discount deal value
 * 4. Recency (creation timestamp)
 */
export function sortProductsByPotential<T extends ProductItemInput>(products: T[]): T[] {
  if (!products || products.length === 0) return [];

  return [...products].sort((a, b) => {
    // 1. In Stock priority
    const aStock = (typeof a.stock === 'number' ? a.stock : 1) > 0 ? 1 : 0;
    const bStock = (typeof b.stock === 'number' ? b.stock : 1) > 0 ? 1 : 0;
    if (aStock !== bStock) return bStock - aStock;

    // 2. High Order Count priority
    const aOrders = typeof a.orderCount === 'number' ? a.orderCount : 0;
    const bOrders = typeof b.orderCount === 'number' ? b.orderCount : 0;
    if (aOrders !== bOrders) return bOrders - aOrders;

    // 3. Active Discount Savings Percentage priority
    const aSavings = (a.discountPrice && a.price && a.price > 0) ? ((a.price - a.discountPrice) / a.price) : 0;
    const bSavings = (b.discountPrice && b.price && b.price > 0) ? ((b.price - b.discountPrice) / b.price) : 0;
    if (Math.abs(aSavings - bSavings) > 0.01) return bSavings - aSavings;

    // 4. Creation Recency priority
    const aDate = new Date(a.createdAt || 0).getTime();
    const bDate = new Date(b.createdAt || 0).getTime();
    return bDate - aDate;
  });
}

/**
 * Intelligently separates and deduplicates products across homepage section rows
 * to guarantee no identical product cards repeat across section rows.
 */
export function getHomePageRows<T extends ProductItemInput>(allProducts: T[]) {
  if (!allProducts || allProducts.length === 0) {
    return {
      newArrivals: [] as T[],
      popularBestsellers: [] as T[],
      trendingDeals: [] as T[]
    };
  }

  const totalCount = allProducts.length;
  // Calculate target per row based on catalog size so every row gets unique items
  const targetPerRow = totalCount >= 24 ? 8 : Math.max(4, Math.floor(totalCount / 3));

  // 1. Row 1: New & Latest Products (Admin added / newest createdAt timestamp / fallback by ID)
  const sortedNewest = [...allProducts].sort((a, b) => {
    const aIsPreSeeded = a._id && /^prod-\d+$/.test(String(a._id));
    const bIsPreSeeded = b._id && /^prod-\d+$/.test(String(b._id));
    if (aIsPreSeeded !== bIsPreSeeded) return aIsPreSeeded ? 1 : -1;

    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    if (aTime !== bTime) return bTime - aTime;

    // Fallback sort by ID number descending for preseeded items
    const aNum = parseInt(String(a._id).replace(/\D/g, '') || '0', 10);
    const bNum = parseInt(String(b._id).replace(/\D/g, '') || '0', 10);
    return bNum - aNum;
  });

  const newArrivals = sortedNewest.slice(0, targetPerRow);
  const newArrivalIds = new Set(newArrivals.map(p => String(p._id)));

  // 2. Row 2: Popular & Bestsellers (Order count, rating, or bestseller badge)
  const sortedPopular = [...allProducts].sort((a, b) => {
    const aOrders = typeof a.orderCount === 'number' ? a.orderCount : 0;
    const bOrders = typeof b.orderCount === 'number' ? b.orderCount : 0;
    if (aOrders !== bOrders) return bOrders - aOrders;

    const aRating = typeof (a as any).rating === 'number' ? (a as any).rating : 0;
    const bRating = typeof (b as any).rating === 'number' ? (b as any).rating : 0;
    if (aRating !== bRating) return bRating - aRating;

    const aNum = parseInt(String(a._id).replace(/\D/g, '') || '0', 10);
    const bNum = parseInt(String(b._id).replace(/\D/g, '') || '0', 10);
    return aNum - bNum;
  });

  // Exclude products already in newArrivals so Row 2 has distinct products
  let popularBestsellers = sortedPopular.filter(p => !newArrivalIds.has(String(p._id)));
  if (popularBestsellers.length < targetPerRow) {
    const fillIn = sortedPopular.filter(p => !popularBestsellers.some(bp => String(bp._id) === String(p._id)));
    popularBestsellers = [...popularBestsellers, ...fillIn];
  }
  popularBestsellers = popularBestsellers.slice(0, targetPerRow);

  const usedIds = new Set([
    ...newArrivals.map(p => String(p._id)),
    ...popularBestsellers.map(p => String(p._id))
  ]);

  // 3. Row 3: Trending Items & Deals (Unique remaining items from catalog)
  let trendingDeals = [...allProducts].filter(p => !usedIds.has(String(p._id)));
  if (trendingDeals.length < targetPerRow) {
    const offset = [...allProducts].reverse();
    trendingDeals = [...trendingDeals, ...offset.filter(p => !trendingDeals.some(t => String(t._id) === String(p._id)))];
  }
  trendingDeals = trendingDeals.slice(0, targetPerRow);

  return {
    newArrivals,
    popularBestsellers,
    trendingDeals
  };
}
