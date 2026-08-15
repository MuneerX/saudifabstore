import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';

function getValidUserId(sessionUser: any): string {
  if (sessionUser?.id && /^[0-9a-fA-F]{24}$/.test(sessionUser.id)) {
    return sessionUser.id;
  }
  // Static fallback ObjectId for non-Mongo session IDs (e.g. admin-static-id)
  return '000000000000000000000001';
}

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

    const userId = getValidUserId(session.user);

    try {
      await connectToDatabase();
      
      let cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name price images'
      });
      
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: []
        });
        await cart.save();
      }
      
      return NextResponse.json({ cart });
    } catch (dbErr) {
      console.warn("DB cart query failed, returning empty cart fallback:", dbErr);
      return NextResponse.json({
        cart: {
          user: userId,
          items: []
        }
      });
    }
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
    
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    const userId = getValidUserId(session.user);
    
    // Check if product exists
    const isProductMongoId = /^[0-9a-fA-F]{24}$/.test(productId);
    let product;
    if (isProductMongoId) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ name: productId });
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const qty = typeof quantity === 'number' ? quantity : parseInt(quantity) || 1;
    const itemSize = size || 'Regular';
    const itemColor = color || 'Default Color';
    
    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product && item.product.toString() === (product as any)._id.toString()
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.price,
        size: itemSize,
        color: itemColor
      });
    }
    
    await cart.save();
    
    // Repopulate product details after saving
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
    
    await connectToDatabase();
    const userId = getValidUserId(session.user);
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const isProductMongoId = /^[0-9a-fA-F]{24}$/.test(productId);
    
    // Find item in cart
    const itemIndex = cart.items.findIndex((item: any) => {
      if (!item.product) return false;
      const idStr = item.product.toString();
      return idStr === productId;
    });
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
    }
    
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
    const userId = getValidUserId(session.user);
    
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter((item: any) => {
        if (!item.product) return false;
        return item.product.toString() !== productId;
      });
      await cart.save();
      
      await cart.populate({
        path: 'items.product',
        select: 'name price images'
      });
    }
    
    return NextResponse.json(
      {
        message: 'Item removed from cart successfully',
        cart: cart || { items: [] }
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