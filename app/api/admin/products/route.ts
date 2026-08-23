import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { deleteMultipleFromUploadcare } from '@/lib/utils/uploadcare';

// GET /api/admin/products - Get all products with filters (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    
    // Build filter object
    const filter: {
      category?: string;
      brand?: string;
      price?: { $gte?: number; $lte?: number };
    } = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let totalCount = await Product.countDocuments();
    if (totalCount === 0) {
      try {
        console.log('MongoDB product collection empty. Auto-seeding INITIAL_PRODUCTS...');
        const seedPayload = INITIAL_PRODUCTS.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          brand: p.brand || 'Saudi Fab Store',
          images: p.images || [],
          stock: p.stock || 20,
          isFeatured: p.isFeatured !== undefined ? p.isFeatured : true,
          rating: p.rating || 4.9,
          badge: p.badge || 'BESTSELLER'
        }));
        await Product.insertMany(seedPayload);
        console.log(`Successfully auto-seeded ${seedPayload.length} products to database.`);
      } catch (seedErr) {
        console.warn('Auto-seeding failed, serving in-memory fallback:', seedErr);
      }
    }
    
    let products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    let total = await Product.countDocuments(filter);

    if (!products || products.length === 0) {
      // Fallback response with mapped ID field
      const fallbackList = INITIAL_PRODUCTS.map(p => ({
        _id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        brand: p.brand,
        images: p.images,
        stock: p.stock,
        isFeatured: p.isFeatured,
        rating: p.rating,
        badge: p.badge,
        material: p.material,
        dimensions: p.dimensions,
        weight: p.weight,
        fabricationDetails: p.fabricationDetails,
        surfacePreparation: p.surfacePreparation,
        testingCertifications: p.testingCertifications,
      }));

      return NextResponse.json({
        products: fallbackList,
        totalPages: 1,
        currentPage: 1,
        total: fallbackList.length
      });
    }

    const sanitizedProducts = (products || []).map((p: any) => {
      const pObj = typeof p.toObject === 'function' ? p.toObject() : { ...p };
      const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());

      if (pObj.material === undefined || pObj.material === null) pObj.material = fallbackProd?.material || "";
      if (pObj.dimensions === undefined || pObj.dimensions === null) pObj.dimensions = fallbackProd?.dimensions || "";
      if (pObj.weight === undefined || pObj.weight === null) pObj.weight = fallbackProd?.weight || "";
      if (pObj.fabricationDetails === undefined || pObj.fabricationDetails === null) pObj.fabricationDetails = fallbackProd?.fabricationDetails || "";
      if (pObj.surfacePreparation === undefined || pObj.surfacePreparation === null) pObj.surfacePreparation = fallbackProd?.surfacePreparation || "";
      if (pObj.testingCertifications === undefined || pObj.testingCertifications === null) pObj.testingCertifications = fallbackProd?.testingCertifications || "";

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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/products - Starting product creation');

    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session || !session.user || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    await connectToDatabase();
    console.log('Database connected');

    // Create product instance with incoming payload
    const newProductData = {
      name: body.name,
      description: body.description || '',
      price: typeof body.price === 'number' ? body.price : parseFloat(body.price) || 0,
      discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : undefined,
      category: body.category || 'Steel Fabrication',
      brand: body.brand || 'Saudi Fab Store',
      stock: typeof body.stock === 'number' ? body.stock : parseInt(body.stock) || 0,
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : (body.image ? [body.image] : ['/images/home/category_grid/container_3.jpeg']),
      specImage: body.specImage || '',
      material: body.material || '',
      dimensions: body.dimensions || '',
      weight: body.weight || '',
      fabricationDetails: body.fabricationDetails || '',
      surfacePreparation: body.surfacePreparation || '',
      testingCertifications: body.testingCertifications || '',
      tags: body.tags || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
    };

    console.log('Creating product with data:', newProductData);

    const product = new Product(newProductData);
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: savedProduct
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products - Update a product (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId, ...updateData } = await request.json();
    
    console.log("PUT /api/admin/products - Received update data:", updateData);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    let product = null;
    let oldProduct = null;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(productId);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(productId) : productId;

    const queryFilter = {
      $or: [
        { _id: productId },
        { _id: queryId },
        ...(updateData.name ? [{ name: updateData.name }] : [])
      ]
    };

    oldProduct = await Product.findOne(queryFilter);
    await Product.collection.updateOne(
      queryFilter,
      { $set: updateData }
    );
    product = await Product.findOne(queryFilter);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Automatically purge replaced/removed images from Uploadcare CDN
    if (oldProduct) {
      const oldImages = [...(oldProduct.images || []), oldProduct.specImage].filter(Boolean) as string[];
      const newImages = [...(updateData.images || []), updateData.specImage].filter(Boolean) as string[];
      const removedImages = oldImages.filter(img => !newImages.includes(img));

      if (removedImages.length > 0) {
        deleteMultipleFromUploadcare(removedImages).catch(err => {
          console.error("Error purging replaced images from Uploadcare:", err);
        });
      }
    }
    
    const updatedObj = typeof product.toObject === 'function' ? product.toObject() : { ...product };

    return NextResponse.json(
      { 
        message: 'Product updated successfully',
        product: updatedObj
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

// DELETE /api/admin/products - Delete a product (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
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
    
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(productId) : productId;

    const product = await Product.findOneAndDelete({
      $or: [{ _id: productId }, { _id: queryId }]
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Automatically purge deleted product images from Uploadcare CDN
    const pObj = typeof product.toObject === 'function' ? product.toObject() : product;
    const imagesToPurge = [
      ...(pObj.images || []),
      pObj.specImage,
      pObj.image
    ].filter(Boolean) as string[];

    if (imagesToPurge.length > 0) {
      console.log("Purging deleted product images from Uploadcare:", imagesToPurge);
      deleteMultipleFromUploadcare(imagesToPurge).catch(err => {
        console.error("Error purging deleted product images from Uploadcare:", err);
      });
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
