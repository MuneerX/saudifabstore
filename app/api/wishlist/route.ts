import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Wishlist from '@/lib/models/Wishlist';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';

// GET /api/wishlist - Get user's wishlist
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
    
    let wishlist = await Wishlist.findOne({ user: session.user.id }).populate('products');
    
    if (!wishlist) {
      // Create a new empty wishlist if it doesn't exist
      wishlist = new Wishlist({
        user: session.user.id,
        products: []
      });
      await wishlist.save();
    }
    
    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
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
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: session.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: session.user.id,
        products: []
      });
    }
    
    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.products.findIndex(
      (product: string) => product.toString() === productId
    );
    
    if (existingItemIndex === -1) {
      // Add item to wishlist if it doesn't exist
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    // Populate product details before returning
    await wishlist.populate('products');
    
    return NextResponse.json(
      { 
        message: 'Item added to wishlist successfully',
        wishlist
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove item from wishlist
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
    
    const wishlist = await Wishlist.findOne({ user: session.user.id });
    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }
    
    // Remove item from wishlist
    wishlist.products = wishlist.products.filter(
      (product: string) => product.toString() !== productId
    );
    
    await wishlist.save();
    
    // Populate product details before returning
    await wishlist.populate('products');
    
    return NextResponse.json(
      { 
        message: 'Item removed from wishlist successfully',
        wishlist
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}