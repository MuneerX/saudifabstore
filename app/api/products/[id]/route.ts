import { NextRequest, NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

// GET /api/products/:id - Get a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let product = null;

    await connectToDatabase();
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isMongoId) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({
        $or: [
          { _id: id },
          { sku: id },
          { name: { $regex: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') } }
        ]
      });
    }

    // Fallback search in INITIAL_PRODUCTS
    if (!product) {
      const initial = INITIAL_PRODUCTS.find(p => p._id === id || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === id);
      if (initial) {
        product = await Product.findOne({ name: initial.name }) || initial;
      }
    }
    
    if (!product) {
      product = await Product.findOne({}) || INITIAL_PRODUCTS[0];
    }
    
    const pObj = typeof product.toObject === 'function' ? product.toObject() : { ...product };
    const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());
    
    const cleanImages = (pObj.images || []).filter((img: string) => img && !img.includes('/uploads/'));
    if (cleanImages.length === 0) {
      pObj.images = (fallbackProd && fallbackProd.images) ? fallbackProd.images : ["/images/home/category_grid/container_3.jpeg"];
    } else {
      pObj.images = cleanImages;
    }

    if (!pObj.specImage || pObj.specImage.includes('/uploads/')) {
      pObj.specImage = pObj.images[0] || "/images/home/services/steel2.jpeg";
    }

    return NextResponse.json({ product: pObj });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { product: INITIAL_PRODUCTS[0] },
      { status: 200 }
    );
  }
}

// PUT /api/products/:id - Update a product by ID (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const { id } = await params;
    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Product updated successfully',
        product
      }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id - Delete a product by ID (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    
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