import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
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
      
      // Auto-seed MongoDB Atlas if collection is empty
      if (total === 0 && !category && !brand && !minPrice && !maxPrice) {
        console.log('MongoDB product collection empty, auto-seeding products into Atlas...');
        for (const prodData of INITIAL_PRODUCTS) {
          const { _id, ...rest } = prodData;
          await Product.create(rest);
        }
        products = await Product.find(filter)
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 });
        total = await Product.countDocuments(filter);
      }
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
    
    // Preserve product images, specImage diagrams, and technical specification fields
    const sanitizedProducts = (products || []).map((p: any) => {
      const pObj = typeof p.toObject === 'function' ? p.toObject() : { ...p };
      const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());
      
      if (!pObj.images || pObj.images.length === 0) {
        pObj.images = (fallbackProd && fallbackProd.images) ? fallbackProd.images : ["/images/home/category_grid/warehouse.jpeg"];
      }

      if (!pObj.specImage) {
        pObj.specImage = "";
      }

      if (pObj.material === undefined || pObj.material === null) pObj.material = fallbackProd?.material || "";
      if (pObj.dimensions === undefined || pObj.dimensions === null) pObj.dimensions = fallbackProd?.dimensions || "";
      if (pObj.weight === undefined || pObj.weight === null) pObj.weight = fallbackProd?.weight || "";
      if (pObj.fabricationDetails === undefined || pObj.fabricationDetails === null) pObj.fabricationDetails = fallbackProd?.fabricationDetails || "";
      if (pObj.surfacePreparation === undefined || pObj.surfacePreparation === null) pObj.surfacePreparation = fallbackProd?.surfacePreparation || "";
      if (pObj.testingCertifications === undefined || pObj.testingCertifications === null) pObj.testingCertifications = fallbackProd?.testingCertifications || "";

      if (!pObj.swatchSingleName) pObj.swatchSingleName = 'Single Standard';
      if (!pObj.swatchBulkName) pObj.swatchBulkName = '5-Pack Contractors';
      if (pObj.swatchBulkPrice === undefined) pObj.swatchBulkPrice = pObj.price * 4.2;
      if (pObj.enableSubscription === undefined) pObj.enableSubscription = true;
      if (pObj.subscriptionDiscountPercent === undefined) pObj.subscriptionDiscountPercent = 10;

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