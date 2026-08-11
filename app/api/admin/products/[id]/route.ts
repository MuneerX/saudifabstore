import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

// GET /api/admin/products/[id] - Get a single product (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const resolvedParams = await params;
    const targetId = resolvedParams.id;
    let product = null;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId);
    if (isMongoId) {
      product = await Product.findById(targetId);
    } else {
      product = await Product.findOne({
        $or: [{ _id: targetId }, { name: targetId.replace(/-/g, ' ') }]
      });
    }

    if (!product) {
      const initial = INITIAL_PRODUCTS.find(p => p._id === targetId || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === targetId);
      if (initial) {
        product = initial;
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const resolvedParams = await params;
    const product = await Product.findByIdAndDelete(resolvedParams.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}