import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    let cart = await Cart.findOne({ user: session.user.id }).populate({
      path: 'items.product',
      select: 'name price images' // Select only necessary fields
    });
    
    if (!cart) {
      // Create a new empty cart if it doesn't exist
      cart = new Cart({
        user: session.user.id,
        items: []
      });
      await cart.save();
    }
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId, quantity, size, color } = await request.json();
    
    if (!productId || !quantity || !size || !color) {
      return NextResponse.json(
        { error: 'Product ID, quantity, size, and color are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      cart = new Cart({
        user: session.user.id,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: { product: string }) => item.product.toString() === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
      // Check if new quantity exceeds stock
      if (cart.items[existingItemIndex].quantity > product.stock) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        );
      }
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        size,
        color
      });
    }
    
    await cart.save();
    
    // Repopulate product details after saving to ensure fresh data
    await cart.populate({
      path: 'items.product',
      select: 'name price images'
    });
    
    return NextResponse.json(
      {
        message: 'Item added to cart successfully',
        cart
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update item quantity in cart
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId, quantity } = await request.json();
    
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }
    
    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex((item: { product: string }) => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    await cart.save();
    
    // Repopulate product details after saving to ensure fresh data
    await cart.populate({
      path: 'items.product',
      select: 'name price images'
    });
    
    return NextResponse.json(
      {
        message: 'Cart updated successfully',
        cart
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    // Remove item from cart
    cart.items = cart.items.filter((item: { product: string }) => item.product.toString() !== productId);
    
    await cart.save();
    
    // Repopulate product details after saving to ensure fresh data
    await cart.populate({
      path: 'items.product',
      select: 'name price images'
    });
    
    return NextResponse.json(
      {
        message: 'Item removed from cart successfully',
        cart
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}