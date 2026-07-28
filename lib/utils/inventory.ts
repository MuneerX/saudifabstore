import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';

/**
 * Update product stock
 * @param productId - ID of the product to update
 * @param quantity - Quantity to add/subtract from stock (negative to reduce stock)
 * @returns Updated product or null if not found
 */
export async function updateProductStock(productId: string, quantity: number) {
  try {
    await connectToDatabase();
    
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } }, // Negative because we're reducing stock when selling
      { new: true, runValidators: true }
    );
    
    return product;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}

/**
 * Check if product has sufficient stock
 * @param productId - ID of the product to check
 * @param quantity - Quantity to check availability for
 * @returns Boolean indicating if sufficient stock is available
 */
export async function hasSufficientStock(productId: string, quantity: number) {
  try {
    await connectToDatabase();
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return false;
    }
    
    return product.stock >= quantity;
  } catch (error) {
    console.error('Error checking product stock:', error);
    throw error;
  }
}

/**
 * Reserve stock for an order (temporarily reduce stock)
 * @param items - Array of items with product ID and quantity
 * @returns Boolean indicating if all items had sufficient stock
 */
export async function reserveStock(items: { product: string; quantity: number }[]) {
  try {
    await connectToDatabase();
    
    // Check if all items have sufficient stock
    for (const item of items) {
      const hasStock = await hasSufficientStock(item.product, item.quantity);
      if (!hasStock) {
        return false;
      }
    }
    
    // Reserve stock for all items
    for (const item of items) {
      await updateProductStock(item.product, item.quantity);
    }
    
    return true;
  } catch (error) {
    console.error('Error reserving stock:', error);
    throw error;
  }
}

/**
 * Release reserved stock (return stock to inventory)
 * @param items - Array of items with product ID and quantity
 */
export async function releaseStock(items: { product: string; quantity: number }[]) {
  try {
    await connectToDatabase();
    
    // Return stock for all items
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true, runValidators: true }
      );
    }
  } catch (error) {
    console.error('Error releasing stock:', error);
    throw error;
  }
}