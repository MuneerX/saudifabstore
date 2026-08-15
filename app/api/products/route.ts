import { NextRequest, NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    
    let dbConnected = false;
    let products: any[] = [];
    let total = 0;

    try {
      await connectToDatabase();
      dbConnected = true;

      // Build filter object
      const filter: {
        category?: string;
        brand?: string;
        price?: { $gte?: number; $lte?: number };
      } = {};
      if (category) filter.category = { $regex: category, $options: 'i' } as any;
      if (brand) filter.brand = brand;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      
      products = await Product.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
        
      total = await Product.countDocuments(filter);
    } catch (dbErr) {
      console.warn("MongoDB connection unavailable, serving BR Products dataset fallback:", dbErr);
    }

    // Fallback to INITIAL_PRODUCTS from BR products.md if DB is empty or offline
    if (!products || products.length === 0) {
      let filtered = [...INITIAL_PRODUCTS];
      if (category) {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
      }
      
      total = filtered.length;
      products = filtered.slice((page - 1) * limit, page * limit);
    }
    
    // Preserve product images and specImage diagrams
    const sanitizedProducts = (products || []).map((p: any) => {
      const pObj = typeof p.toObject === 'function' ? p.toObject() : { ...p };
      const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());
      
      if (!pObj.images || pObj.images.length === 0) {
        pObj.images = (fallbackProd && fallbackProd.images) ? fallbackProd.images : ["/images/home/category_grid/container_3.jpeg"];
      }

      if (!pObj.specImage) {
        pObj.specImage = pObj.images[0] || "/images/home/services/steel2.jpeg";
      }
      return pObj;
    });

    return NextResponse.json({
      products: sanitizedProducts,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { products: INITIAL_PRODUCTS, totalPages: 1, currentPage: 1, total: INITIAL_PRODUCTS.length },
      { status: 200 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const product = new Product(body);
    await product.save();
    
    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}